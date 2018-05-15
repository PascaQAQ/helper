import Trans from '../trans'
import store from '../../store/index'
import dataformat from 'dateformat'
import Axios from '../../assets/js/axios.util'
import { viewer } from '../common/viewer'
import { toastIt } from '../../components/toast/toast'

import '../../assets/css/lostAndFound/lostAndFound.less'

export default class extends React.Component { 
  constructor(props) {
    super(props)
    this.momentDelete = this.momentDelete.bind(this)
    this.state = {
      isMounted: false,
      thingsList: [ ],
      title: '查询',
      page: "1"
    }
  }

  async componentDidMount(type) { 
    this.state.isMounted = true
    if(type==undefined){
      type = this.state.type
    }
    this.setState({ thingList: [ ] })
    document.querySelector('.btn-back').style.color = '#333'


    var load = async (cb) => { //翻页
      var page = this.state.page
      var id = store.userData.data.studentKH
      var code = store.userData.remember_code_app
      try {
        var res = await Axios({
          method: 'POST',
          url: 'api/v3/Loses/search/'
          + store.userData.data.studentKH + '/' + store.userData.data.remember_code_app+ '/' + page,
          data: {
            like: document.querySelector(".searchInput").value
          },
          transformRequest: [
            function (data) {
              let trans = ''
              for (let it in data) {
                trans += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return trans
            }
          ],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        if (res.data.code != 200)
          throw new Error('')
        res.data.goods = this.state.thingsList.concat(res.data.goods) 
      }
      catch (e) {
       toastIt(e)
      }
      finally {
        cb()
      }
      this.state.isMounted && this.setState({ thingsList: res.data.goods, page: ++this.state.page})
    }

    var flag = true
    var el = document.querySelector('.main')
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
  }

  componentWillUnmount() {  
    this.state.isMounted = false
  }

  async momentDelete(v) { 
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app

    toastIt('正在删除')

    var res = await Axios.get(`api/v3/Loses/delete/${id}/${code}/${v}`)
    res.data.code == 200 ? toastIt('已删除') : toastIt('请稍后重试')
    this.componentDidMount()
  }

  async search() {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var like = document.querySelector(".searchInput").value
    if (like)
    var res = await Axios({
      method: 'POST',
      url: 'api/v3/Loses/search/'
      + store.userData.data.studentKH + '/' + store.userData.data.remember_code_app ,
      data: {
        like: like
      },
      transformRequest: [
        function (data) {
          let trans = ''
          for (let it in data) {
            trans += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return trans
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    this.state.isMounted && this.setState({ thingsList: res.data.goods ,page: ++this.state.page})
    if (res.data.code != 200)
      throw new Error('')
    else if (res.data.goods == '')
      toastIt("未搜索到相关信息")
  }

  render() {
    var state = this.state
    return (
      <Trans className="things">
        <nav> 
          { this.state.title }
          <i 
            className="fa-plus create" 
            onClick={ () => this.props.onViewChange('#lafCreate') } />
          <i 
            className="fa-search create search" 
            onClick={ () => this.props.onViewChange('#lafSearch') } />
        </nav>
        <section className="main">
          <div className="lafSearch">
            <input className="searchInput"/>
            <button className="btn-search" onClick = { () =>this.search() }>查询</button>
          </div>
          <div className="things-boxes">
          {
          	state.thingsList.map((v,i) =>
              <div className="things-box" key = { i }>
                <div className="thingTitle">
                  <p> { v.tit } </p> 
                  { v.type == 2? <p> 失物  </p> : <p> 招领 </p> }
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
