import Trans from '../trans'
import store from '../../store/index'
import dataformat from 'dateformat'
import Axios from '../../assets/js/axios.util'
import Post from '../../assets/js/post.util'
import jokesView from './jokesView'
import { viewer } from '../common/viewer'
import { toastIt } from '../../components/toast/toast'

import '../../assets/css/jokes/jokes.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.commentClick = this.commentClick.bind(this)
    this.commentSubmit = this.commentSubmit.bind(this)
    this.commentDelete = this.commentDelete.bind(this)
    this.momentDelete = this.momentDelete.bind(this)
    this.state = { 
      isMounted: false, 
      picUrl: '', 
      jokesList: [ ], 
      title: '校园段子',

      // default values
      headerPicThumb: store.picPrefix + store.userData.data.head_pic_thumb,
      headerPic: store.picPrefix + store.userData.data.head_pic,
      headerName: store.userData.data.username || store.userData.data.TrueName,
      headerDep: store.userData.data.dep_name,
      headerBio: store.userData.data.bio,
      jokeUserId: store.userData.data.user_id
    }
  }

  async componentDidMount() {
    var userId = this.props.userId
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var depName = store.userData.data.dep_name
    var picUrl = store.picPrefix + '/' + store.userData.data.head_pic_thumb
    var resJoke = null
    var el = document.querySelector('.main')
    
    // disabled scroll event if no items in list
    el.onscroll = _ => _

    if (userId) {
      // cur joke user
      this.state.jokeUserId = userId

      if (userId === store.userData.data.user_id)
        this.setState({ title: '我的段子' })
      else
        this.setState({ title: '此人的段子' })

      this.setState({ headerPicThumb: '', headerName: ' ', headerDep: ' ' })

      Axios.get(`/api/v3/set/user_info/${id}/${code}/${userId}`)
      .then(res => {
        this.setState({ 
          headerPicThumb: store.picPrefix + res.data.data.head_pic_thumb, 
          headerPic: store.picPrefix + res.data.data.head_pic, 
          headerName: res.data.data.username, 
          headerDep: res.data.data.dep_name,
          headerBio: res.data.data.bio,
        })
      })
    }

    resJoke = null
    this.state.isMounted = true
    store.jokePage = 1
    this.setState({ jokesList: [ ] })
    document.querySelector('.btn-back').style.color = '#333'

    try {
      if (userId) {
        resJoke = await 
        Axios.get(`/api/v3/statement/get_statement/${store.jokePage}/${userId}`)
      } else {
        resJoke = await 
        Axios.get(`/api/v3/statement/get_statement/${store.jokePage}`)
      }

      var ids = resJoke.data.statement.map(v => v.id)

      if (ids.length == 0)
        toastIt('这个人很懒，没有发过段子')

      this.state.isMounted && this.setState({ picUrl, jokesList: resJoke.data.statement })
    }
    catch (e) {
      console.error(e)
      toastIt(e.message)
    }

    var load = async (cb) => {
      try {
        if (userId) {
          resJoke = await 
          Axios.get(`/api/v3/statement/get_statement/${++store.jokePage}/${userId}`)
        } else {
          resJoke = await 
          Axios.get(`/api/v3/statement/get_statement/${++store.jokePage}`)
        }

        if (store.jokePage >= resJoke.data.pageination) return

        if (resJoke.data.code != 200)
          throw new Error('')

        var ids = resJoke.data.statement.map(v => v.id)

        resJoke.data.statement = this.state.jokesList.concat(resJoke.data.statement)
      }
      catch (e) {
        store.jokePage--
      }
      finally {
        cb()
      }
      
      this.state.isMounted && this.setState({ picUrl, jokesList: resJoke.data.statement })
    }

    setTimeout(() => {
      var flag = true
      el.onscroll = () => {
        if (el.scrollHeight - el.clientHeight - el.scrollTop < 100) {
          if (flag) {
            load(() => {
              if (el.scrollHeight - el.clientHeight - el.scrollTop < 100)
                flag = false
            })
          }
          flag = false
        } else {
          flag = true
        }
      }
    }, 500)
  }

  componentWillUnmount() {
    this.state.isMounted = false
  }

  async commentDelete(v) {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app

    toastIt('正在删除')

    var res = await Axios.get(`/api/v3/statement/deletec/${id}/${code}/${v.id}`)
    res.data.msg === 'ok' ? toastIt('已删除') : toastIt(res.data.msg)
    this.componentDidMount()
  }

  async momentDelete(v) {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app

    toastIt('正在删除')

    var res = await Axios.get(`/api/v3/statement/deleteWechat/${id}/${code}/${v}`)
    res.data.code == 200 ? toastIt('已删除') : toastIt('请稍后重试')
    this.componentDidMount()
  }

  commentClick = (i) => {
    var el = document.getElementsByClassName('submit')[i]
    if (el.style.display == '') {
      el.style.display = 'flex'
      el.childNodes[0].focus()
    } else {
      el.style.display = ''
    }
  }

  commentSubmit = (v, i) => {
    var userData = store.userData.data
    var value = document.getElementsByClassName('input')[i].value

    if (value.trim() == '') {
      toastIt('请输入评论内容')
      return
    }

    Post({
      url: 'api/v3/statement/comment/' + userData.studentKH + '/' + userData.remember_code_app,
      data: {
        comment : value,
        moment_id : v.id
      }
    }).then(res => {
      v.comments.push({
        moment_id: v.id,
        id: '1',
        user_id: '1',
        comment: value,
        username: store.userData.data.username,
      })

      this.state.isMounted && this.setState({ jokesList: this.state.jokesList })
      
      if (res.data.code == 200)
        toastIt('评论成功~')
      else
        toastIt('评论出错')
    }).catch(function(error) {
      toastIt('评论出错')
      console.error(error)
    })
  }

  render() {
    var state = this.state
    var userData = store.userData.data

    return (
      <section className="main scroll">
        <header>
          <img 
            className="head" src={ this.state.headerPicThumb }
            onClick={ () => viewer(this.state.headerPicThumb, this.state.headerPic) } 
            alt="学校图片服务器炸了" />
          <div 
            onClick={ 
              this.state.jokeUserId == store.userData.data.user_id ?
              () => jokesView(store.userData.data.user_id) : _ => _
            }
            className="info">
            <div className="name">
              { this.state.headerName }
            </div>
            <div className="subject">
              { this.state.headerDep }
            </div>
            <div className="subject">
              { this.state.headerBio }
            </div>
          </div>
        </header>
        
        <section className="joke-boxes">
        {
          state.jokesList.map((v, i) =>
            <div className="joke-box" key={ i }>
              <div className="person">
                <img 
                  className={ 'photo photo-' + v.id }
                  width="40"
                  height="40"
                  alt="图裂开了"
                  onClick={ () => viewer(
                    store.picPrefix + v.head_pic_thumb,
                    store.picPrefix + v.head_pic
                  ) } 
                  src={ store.picPrefix + v.head_pic_thumb } />
                <div className="user-info">
                  <div 
                    onClick={ () => jokesView(v.user_id) }
                    className="user-name" >
                    { v.username }
                    <span className="user-bio">
                      { v.bio }
                    </span>
                  </div>
                  <div className="user-dep">
                    { v.created_on + " " + v.dep_name }
                  </div>
                </div>
              </div>
              <div className="content">
                { v.content }
                {
                  store.userData.data.user_id == v.user_id ?
                  <span className="del-moment" onClick={ this.momentDelete.bind(this, v.id) }>
                    &nbsp; 删除
                  </span> : ''
                }
              </div>
              <div className={ 'img-boxes' }>
                { 
                  v.pics.map((u, i) => 
                    <div className="img" key={ i }>
                      <div className="fill"></div>
                      <div className="img-content">
                        <img
                          className="img-box"
                          onClick={ () => viewer(
                            store.picPrefix + u,
                            store.picPrefix + u.replace(/_thumb/, '')
                          ) }
                          alt="图裂开了"
                          src={ store.picPrefix + u } />
                      </div>
                    </div>
                  )
                }
              </div>
              <div className="action" >
                <i className="fa-4x fa fa-commenting-o" onClick={ () => this.commentClick(i) } >
                </i>
              </div>
              <div className="submit">
                <textarea 
                  autoComplete="false" 
                  spellCheck="false" 
                  className="input" rows="2" />
                <button 
                  className="btn-create-comment" 
                  onClick={ () => this.commentSubmit(v, i) }>
                  发布
                </button>
              </div>
              <div className="comment-boxes">
                {
                  v.comments.map((z, k) =>
                    <div className='comment-box' key={ k }>
                      <span 
                        onClick={ () => jokesView(z.user_id) }
                        className="comment-box-name">
                        { z.username }
                      </span>
                      { " : " + z['comment'] }
                      {
                        z.user_id == store.userData.data.user_id ?
                        <span className="del" onClick={ this.commentDelete.bind(this, z) }>
                          删除
                        </span> :
                        ''
                      }
                    </div>
                  )
                }
              </div>
            </div>
          )
        }
        </section>
      </section>
    )
  }
}
