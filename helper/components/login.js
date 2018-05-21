import React from 'react'
import Trans from './trans'
import store from '../store'
import Axios from '../assets/js/axios.util'
import { toastIt } from '../components/toast/toast'

import '../assets/css/login.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleKeyPress(e) {
    if (e.key == 'Enter') {
      this.handleLogin()
    }
  }

  async handleLogin(e) {
    try {
      var username = document.querySelector('#username').value.trim()
      var password = document.querySelector('#password').value
      var btnLogin = document.querySelector('#btn-login')

      if (!username || !password) {
        toastIt('请输入学号和密码')
        return
      }

      btnLogin.innerHTML = '正在登录...'
      btnLogin.disabled = true

      var isMiniProg = window.__wxjs_environment === 'miniprogram'

      var res = await 
      Axios.get(`/api/v3/get/loginWx/${username}/${password}/${isMiniProg ? 4 : 0}`)

      if (res.data.code === 304) {
        toastIt(res.data.msg || '用户名或密码错误')
        btnLogin.innerHTML = '登 录'
        btnLogin.disabled = false
        return
      }

      if (res.data.code !== 200) {
        toastIt(res.data.msg || '登录失败')
        btnLogin.innerHTML = '登 录'
        btnLogin.disabled = false
        return
      }

      localStorage.clear()

      store.userData = res.data
      store.userData.data = store.userData.data || { }
      store.userData.data.head_pic = 
      store.userData.data.head_pic_thumb.replace(/_thumb/, '')
      localStorage.setItem('userData', JSON.stringify(res.data))

      history.back()
    }
    catch (e) {
      toastIt(e.message)
    }
    finally {
      btnLogin.innerHTML = '登 录'
      btnLogin.disabled = false
    }
  }

  render() {
    return (
      <Trans className="login">
        <section className="main">
          <header>
            <h1 className="title">工大助手</h1>
          </header>		
          <section className="form">
            <input 
              onKeyPress={this.handleKeyPress}
              id="username" className="input" placeholder="学 号" />
            <input
              onKeyPress={this.handleKeyPress}
              id="password" className="input" placeholder="密 码" />
            <button id="btn-login" className="btn-login" onClick={ this.handleLogin }>
              登 录
            </button>
          </section>
        </section>
        <section className="footer">
          <div className="tip">密码默认为身份证后六位，如有 x 则为小写</div>
          <a className="reset" href="https://api.huthelper.cn/auth/resetpass" taget="_blank">
            重置密码
          </a>
        </section>
      </Trans>
    )
  }
}
