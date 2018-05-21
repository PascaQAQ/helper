import Trans from '../trans'
import store from '../../store/index'
import dataformat from 'dateformat'
import Axios from '../../assets/js/axios.util'
import Post from '../../assets/js/post.util'
import { details } from '../common/details'
import { toastIt } from '../../components/toast/toast'

import '../../assets/css/shop.less'

export default class extends React.Component { 
  constructor(props) {
    super(props)
    this.momentDelete = this.momentDelete.bind(this)
    this.state = {
      isMounted: false,
      shopsList: [ ],
      title: '二手市场',
      type: '0', 
      isSearch: false,
      activeType: ['type active', 'type', 'type']
    }
  }

  async componentDidMount(type) {  
    var el = document.querySelector('.main')
    // disabled scroll event if no items in list
    el.onscroll = _ => _
    this.state.isMounted = true
    store.shopPage = 1
    
    if (type == undefined){
      type = this.state.type
    }
    this.setState({ shopsList: [ ] })
    document.querySelector('.btn-back').style.color = '#333'
    document.querySelector('.btn-back').style.zIndex = 4
    try {
      var id = store.userData.data.studentKH
      var code = store.userData.remember_code_app
      
      var resShop = await 
      Axios.get(`api/v3/trade/goods/${store.shopPage}/${type}`)
      this.state.isMounted && this.setState({ shopsList: resShop.data.goods ,isSearch: false})
    }
    catch (e) {
      console.error(e)
      toastIt(e.message)
    }
  
    var load = async (cb) => {
      try {
        resShop = await 
        Axios.get(`api/v3/trade/goods/${++store.shopPage}/${type}`)
        if (resShop.data.code != 200)
          throw new Error('')

        if (store.shopPage >= resShop.data.pageination) return

        resShop.data.goods = this.state.shopsList.concat(resShop.data.goods)
      }
      catch (e) {
        store.shopPage--
      }
      finally {
        cb()
      }
      this.state.isMounted && this.setState({ shopsList: resShop.data.goods })
    }

    var searchLoad = async (cb) => {
      var page = ++store.shopPage
      var id = store.userData.data.studentKH
      var code = store.userData.remember_code_app
      
      try {
        var res = await Post({
          url: 'api/v3/trade/search/' + 
          store.userData.data.studentKH + '/' + 
          store.userData.data.remember_code_app + '/' + page,
          data: {
            like: document.querySelector(".search-input").value
          }
        })

        if (res.data.code != 200)
          throw new Error('')

        if (store.shopPage >= res.data.pageination) return

        res.data.goods = this.state.shopsList.concat(res.data.goods) 
      }
      catch (e) {
        store.shopPage--
      }
      finally {
        cb()
      }
      this.state.isMounted && this.setState({ shopsList: res.data.goods})
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

  componentWillUnmount() {  //组件从DOM中删除时调用
    this.state.isMounted = false
  }


  async momentDelete(v) { //删除
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var res = await Axios.get(`api/v3/trade/delete/${id}/${code}/${v}`)
    res.data.code == 200 ? toastIt('已删除') : toastIt('请稍后重试')
    this.componentDidMount()
  }

  changeType(e) {
  	let activeType = ['type', 'type', 'type']
  	activeType[e] = 'type active'
  	this.state.isMounted && this.setState(
      { type: e, activeType: activeType }) 
    this.componentDidMount(e)
  }
  
  async toDetails(goodsId){
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var res = await Axios.get(`api/v3/trade/details/${id}/${code}/${goodsId}`)
    res.data.code == 200 ? '' : toastIt('正在加载')
    details(res.data.data)
  }

  async search() {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var like = document.querySelector(".search-input").value
    store.shopPage = 1
    if (like)
    var res = await Post({
      url: 'api/v3/trade/search/'
      + store.userData.data.studentKH + '/' + store.userData.data.remember_code_app ,
      data: {
        like: like
      }
    })
    this.state.isMounted && this.setState({ shopsList: res.data.goods ,isSearch: true})
    if (res.data.code != 200)
      throw new Error('')
    else if (res.data.goods == '')
      toastIt("未搜索到相关信息")
  }

  render() {
    var state = this.state
    return (
      <Trans className="shop">
        <nav> 
          { this.state.title }
          <i 
            className="fa-plus-1 create" 
            onClick={ () => this.props.onViewChange('#shopCreate') } />
        </nav>
        <section className="main scroll">
          <header>
            <div className="types">
              <div id="0" className={ state.activeType[0] } onClick = { e => this.changeType(e.target.id) }>全部</div>
              <div id="1" className={ state.activeType[1] } onClick = { e => this.changeType(e.target.id) }>出售</div>
              <div id="2" className={ state.activeType[2] } onClick = { e => this.changeType(e.target.id) }>求购</div>
            </div>
          </header>
          <div className="shop-search">
            <input className="search-input" placeholder="输入关键字"/>
            <button className="btn-search" onClick = { () =>this.search() }>搜索</button>
          </div>
          <div className="shop-boxes">
          {
          	state.shopsList.map((v,i) => 
              <div className="shop-box" key = { i } onClick = { this.toDetails.bind( this,v.id ) }>
                <div className="img-box">
                  <div className="fill"></div>
                  <div className="img-content">
                    <img alt="图裂开了"
                      src={ store.picPrefix + v.image } />
                  </div>
                </div>
                <div className="shop-content">
                {
                  store.userData.data.user_id == v.user_id ?
                  <span className="del-moment" onClick={ this.momentDelete.bind(this, v.id) }>
                    &nbsp; 删除
                  </span> : ''
                }  
                  <div className="shop-title">
                    { v.tit }
                  </div>
                  <div className="shop-message">
                    <span className="shop-time">{ v.created_on }</span>
                    <span className="shop-price">¥ { v.prize }</span>
                  </div>
                </div>
              </div>
            )
          }
          </div>
        </section>
      </Trans>
    )
  }
}
