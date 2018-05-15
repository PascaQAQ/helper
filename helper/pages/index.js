import React from 'react'
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
import LostAndFound from '../components/lostAndFound/lostAndFound'
import LAFCreate from '../components/lostAndFound/lafCreate'
import LAFSearch from '../components/lostAndFound/lafSearch'
import Profile from '../components/profile/profile'
import ChangePic from '../components/profile/changPic'
import JokesCreate from '../components/jokes/jokesCreate'
import { toastIt } from '../components/toast/toast'

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
  lostAndFound: LostAndFound,
  lafCreate: LAFCreate,
  lafSearch: LAFSearch,
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
      var hash = location.hash
      if (hash == '#') hash = '#home'
      this.handleViewChange(hash, true)
    }
    
    store.userData = JSON.parse(localStorage.getItem('userData'));

    // Wechat font size
    (function() {
      if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize()
      } else {
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", handleFontSize, false)
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", handleFontSize)
          document.attachEvent("onWeixinJSBridgeReady", handleFontSize)
        }
      }
  
      function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 })
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function() {
          WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 })
        })
      }
    })()

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

    // Wechat top bar
    // See:
    // https://www.jianshu.com/p/2eddee561971
    // https://www.cnblogs.com/jasonwang2y60/p/6848464.html
  }

  backClick() {
    history.back()
  }

  handleViewChange(v, isBack = false) {
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
      <div className="app">
      {
        !~['login', 'home'].indexOf(this.state.view) ?
        <a className="btn-back"
          onClick={ this.backClick }>
          <i className="fa fa-angle-left fa-2x"></i>
        </a> : ''
      }
        <Comp onViewChange={ this.handleViewChange } />
        <div id="dialog"></div>
      </div>
    )
  }
}
