import Trans from '../trans'
import store from '../../store/index'
import dataformat from 'dateformat'
import Axios from '../../assets/js/axios.util'
import Post from '../../assets/js/post.util'
import { viewer } from '../common/viewer'
import { toastIt } from '../../components/toast/toast'

import '../../assets/css/lostAndFound/lostAndFound.less'

export default class extends React.Component { 
  constructor(props) {
    super(props)
    this.momentDelete = this.momentDelete.bind(this)
    this.state = {
      isMounted: false,
      isSearch: false,
      thingsList: [ ],
      title: '失物招领',
      type: '0', 
      activeType: ['type active', 'type', 'type']
    }
  }

  async componentDidMount(type) {  
    this.state.isMounted = true
    store.thingPage = 1
    var el = document.querySelector('.main')

    // disabled scroll event if no items in list
    el.onscroll = _ => _
    
    if(type == undefined){
      type = this.state.type
    }
    this.setState({ thingList: [ ] })
    document.querySelector('.btn-back').style.color = '#333'

    try {
      var id = store.userData.data.studentKH
      var code = store.userData.remember_code_app
      
      var resThing = await 
      Axios.get(`/api/v3/Loses/goods/${store.thingPage}/${type}`)

      this.state.isMounted && this.setState({ thingsList: resThing.data.goods })
    }
    catch (e) {
      console.error(e)
      toastIt(e.message)
    }

    var load = async (cb) => { 
      try {
        resThing = await 
        Axios.get(`api/v3/Loses/goods/${++store.thingPage}/${type}`)
        if (resThing.data.code != 200)
          throw new Error('')
        
        if (store.thingPage >= resThing.data.pageination) return

        // concat合并为一个数组并返回
        resThing.data.goods = this.state.thingsList.concat(resThing.data.goods) 
      }
      catch (e) {
        store.thingPage--
      }
      finally {
        cb()
      }
      this.state.isMounted && this.setState({ thingsList: resThing.data.goods })
    }
    
    var searchLoad = async (cb) => {
      var page = ++store.thingPage
      var id = store.userData.data.studentKH
      var code = store.userData.remember_code_app
      
      try {
        var res = await Post({
          url: 'api/v3/Loses/search/'
          + store.userData.data.studentKH + '/' + store.userData.data.remember_code_app+ '/' + page,
          data: {
            like: document.querySelector(".search-input").value
          }
        })

        if (res.data.code != 200)
          throw new Error('')

        if (store.thingPage >= res.data.pageination) return

        res.data.goods = this.state.thingsList.concat(res.data.goods) 
      }
      catch (e) {
        store.thingPage--
      }
      finally {
        cb()
      }
      this.state.isMounted && this.setState({ thingsList: res.data.goods})
    }


    // waiting for list fill
    setTimeout(() => {
      var flag = true
      el.onscroll = () => {
        if (el.scrollHeight - el.clientHeight - el.scrollTop < 100) {
          if (flag) {
            if(this.state.isSearch)
            searchLoad(() => {
              if (el.scrollHeight - el.clientHeight - el.scrollTop < 100)
                flag = false
            })
            else
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

  async momentDelete(v) {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app

    toastIt('正在删除')

    var res = await Axios.get(`api/v3/Loses/delete/${id}/${code}/${v}`)
    // res.data.code == 200 ? toastIt('已删除') : toastIt('请稍后重试')
    this.componentDidMount()
  }

  async search() {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var like = document.querySelector(".search-input").value
    store.thingPage = 1
    if (like)
    var res = await Post({
      url: 'api/v3/Loses/search/'
      + store.userData.data.studentKH + '/' + store.userData.data.remember_code_app ,
      data: {
        like: like
      }
    })
    this.state.isMounted && this.setState({ thingsList: res.data.goods ,isSearch: true})
    if (res.data.code != 200)
      throw new Error('')
    else if (res.data.goods == '')
      toastIt("未搜索到相关信息")
  }

  changeType(e) {
  	let activeType = ['type', 'type', 'type']
  	activeType[e] = 'type active'
  	this.state.isMounted && this.setState(
      { type: e , activeType: activeType }) 
    this.componentDidMount(e)
  }

  render() {
    var state = this.state
    return (
      <Trans className="things">
        <nav> 
          { this.state.title }
          <i 
            className="fa-plus-1 create" 
            onClick={ () => this.props.onViewChange('#lafCreate') } />
        </nav>
        <section className="main scroll">
          <header>
            <div className="types">
              <div id="0" className={ state.activeType[0] } onClick = { e => this.changeType(e.target.id) }>全部</div>
              <div id="1" className={ state.activeType[1] } onClick = { e => this.changeType(e.target.id) }>招领</div>
              <div id="2" className={ state.activeType[2] } onClick = { e => this.changeType(e.target.id) }>丢失</div>
            </div>
          </header>
          <div className="lafSearch">
            <input className="search-input" placeholder="输入关键字"/>
            <button className="btn-search" onClick = { () =>this.search() }>搜索</button>
          </div>
          <div className="things-boxes">
          {
          	state.thingsList.map((v, i) =>
              <div className="things-box" key = { i }>
                <div className="thingTitle">
                  <p>{ v.tit }</p> 
                  { v.type == 2 ? <p>失物</p> : <p className="type-2">招领</p> }
                </div>
                <div className="thingMessage">
                { '地点：' + v.locate} 
                {
                  store.userData.data.user_id == v.user_id ?
                  <span className="del-moment" onClick={ this.momentDelete.bind(this, v.id) }>
                    &nbsp; 删除
                  </span> : ''
                }                
                </div>
                <div className="thingContent"> { v.content } </div>
                <div className="thingImg">
                { 
                  v.pics.map((u, i) => 
                    <div className="img" key= { i }>
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
                <div className="thingNum"> { v.time } </div>
                <div className="thingNum"> { '联系方式：' + v.phone } </div>
              </div>
            )
          }
          </div>
        </section>
      </Trans>
    )
  }
}
