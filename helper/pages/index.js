import React from 'react'
import ReactDOM from 'react-dom'
import store from '../store/index'
import Home from '../components/home'
import Exam from '../components/exam'
import Power from '../components/power'
import Score from '../components/score'
import Login from '../components/login'
import Pencil from '../components/pencil'
import Library from '../components/library'
import Find from '../components/find'
import Jokes from '../components/jokes/jokes'
import Lesson from '../components/lesson/lesson'
import Shop from '../components/shop/shop'
import ShopCreate from '../components/shop/shopCreate'
import LostAndFound from '../components/lostAndFound/lostAndFound'
import LAFCreate from '../components/lostAndFound/lafCreate'
import Profile from '../components/profile/profile'
import ChangePic from '../components/profile/changPic'
import JokesCreate from '../components/jokes/jokesCreate'
import { toastIt } from '../components/toast/toast'

import '../assets/css/index/index.less'

// router
var components = {
  home: Home,
  exam: Exam,
  power: Power,
  login: Login,
  score: Score,
  jokes: Jokes,
  pencil: Pencil,
  lesson: Lesson,
  profile: Profile,
  changePic: ChangePic,
  jokesCreate: JokesCreate,
  library: Library,
  find: Find,
  shop: Shop,
  shopCreate: ShopCreate,
  lostAndFound: LostAndFound,
  lafCreate: LAFCreate,
}

var dev = process.env.NODE_ENV !== 'production'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.handleViewChange = this.handleViewChange.bind(this)
    this.backClick = this.backClick.bind(this)
    this.state = { view: 'home' }
  }

  componentDidMount() {
    window.onpopstate = (evt) => {
      if (store.jokesView == 1) {
        ReactDOM.unmountComponentAtNode(document.querySelector('#details'))
        document.querySelector('.jokes-src').style.display = ''
        store.jokesView = 0
      } else {
        var hash = location.hash
        if (hash == '#') hash = '#home'
        this.handleViewChange(hash, true)
      }
    }
    
    store.userData = JSON.parse(localStorage.getItem('userData'));

    // when refresh the page
    var grep = /#(.*)$/.exec(location.hash)
    var comp = (grep && grep.length > 1) ? grep[1] : 'home'
    if (comp !== 'home' && store.userData && store.userData.data) {
      this.setState({ view: comp })
    }

    // Service Workers
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('sw.js').then(function(registration) {
    //     console.log('ServiceWorker registration successful with scope: ', registration.scope)
    //   }).catch(function(err) {
    //     console.log('ServiceWorker registration failed: ', err)
    //   })
    // }

    // Baidu schema
    if (!dev) {
      window._hmt = []
      if (store.userData && store.userData.data) {
        window._hmt.push(['_setCustomVar', 1, 'dep_name', store.userData.data.dep_name, 2])
        window._hmt.push(['_setCustomVar', 3, 'grade', store.userData.data.studentKH.substring(0, 2), 2])
        window._hmt.push(['_setCustomVar', 2, 'isLogin', '1', 2])
      } else {
        window._hmt.push(['_setCustomVar', 2, 'isLogin', '0', 2])
      }

      (function() {
        var hm = document.createElement("script")
        hm.src = "https://hm.baidu.com/hm.js?5c967045fd7156544ea127f38cc9d945"
        var s = document.getElementsByTagName("script")[0]
        s.parentNode.insertBefore(hm, s)
      })()
    }
  }

  backClick() {
    history.back()
  }

  handleViewChange(v, isBack = false) {
    if (window.__wxjs_environment === 'miniprogram' && ~['#library'].indexOf(v)) {
      alert('因小程序限制，请用浏览器访问工大助手 Web 端来访问图书馆: http://huthelper.cn，或者关注「HUT助手」公众号，在下方菜单中选择图书馆')
      return
    }


    if (!dev) window._hmt.push(['_trackPageview', '/' + v])
    
    var back = document.querySelector('.btn-back')
    if (back) back.style.color = '#333'

    if (v !== '#home') {
      var userData = JSON.parse(localStorage.getItem('userData'))
      if (!userData || userData.code !== 200) {
        store.lastPage = 'home'
        if (this.state.view !== 'login') {
          this.setState({ view: 'login' })
          history.pushState(null, null, '#login')
        }
        return
      }
    }
  
    store.lastPage = this.state.view
    var grep = /#(.*)$/.exec(v)
    var comp = (grep && grep.length > 1) ? grep[1] : 'home'
    this.setState({ view: comp })

    if (!isBack && v !== '#home') {
      history.pushState(null, null, v)
    }
  }

  render() {
    var Comp = components[this.state.view]
    return (
      <div className="index">
        <aside className="hidden-sm scroll">
          <section className="title-item-warp">
            <a 
              className="item-user item-warp"
              onClick={ this.handleViewChange.bind(this, '', false) }>
              <i className={ `fa fa-home` }></i>
              <span className="item-name">首页</span>
            </a>
            <a 
              className="item-user item-warp"
              onClick={ this.handleViewChange.bind(this, '#profile', false) }>
              <i className={ `fa fa-user-o` }></i>
              <span className="item-name">用户中心</span>
            </a>
          </section>
          {
            store.btnItems.map((v, i) =>
              <a 
                key={ i }
                className="item item-warp "
                onClick={ this.handleViewChange.bind(this, '#' + v.page, false) }>
                <i className={ `fa fa-${v.class}` }></i>
                <span className="item-name">{ v.name }</span>
              </a>
            )
          }
        </aside>
        <div className="main-content">
          {
            !~['login', 'home'].indexOf(this.state.view) ?
            <a className="btn-back"
              onClick={ this.backClick }>
              <i className="fa fa-angle-left fa-2x"></i>
            </a> : ''
          }
          <Comp onViewChange={ this.handleViewChange } />
          <div id="dialog"></div>
          <div id="details"></div>
        </div>
      </div>
    )
  }
}
