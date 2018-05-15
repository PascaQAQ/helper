import sha1 from 'sha1'
import React from 'react'
import store from '../store'
import Trans from './trans'
import dataformat from 'dateformat'
import Axios from '../assets/js/axios.util'
import { toastIt } from '../components/toast/toast'

import '../assets/css/find.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.handleQuery = this.handleQuery.bind(this)
    this.handleViewChange = this.handleViewChange.bind(this)
    this.$ = document.querySelector.bind(document)
    this.state = { isMounted: false, studentMessage: [] }
  }

  handleViewChange(v) {
    this.props.onViewChange(v)
  }

  componentDidMount() {
  	document.querySelector(".btn-back").style.color = "#333"
    this.state.isMounted = true
  }
  
  returnLogin() {
  	document.querySelector('#studentName').style.display = "block" 
    document.querySelector('#btn-login').style.display = "block" 
    document.querySelector('#return-login').style.display = "none"
    document.querySelector('.message-boxes').style.display = "none" 
  }
  
  async handleQuery(e) {
    try {
    	var nameInput = this.$('#studentName')
      var studentName = nameInput.value.trim()
      var btnLogin = this.$('#btn-login')
      var returnLogin = this.$('#return-login')

      if (!studentName) {
        toastIt('姓名不能为空')
        return
      }

      btnLogin.innerHTML = '正在查询...'
      btnLogin.disabled = true

      var id = store.userData.data.studentKH
      var code = store.userData.remember_code_app
      var date = dataformat('yyyy-mm')
      var enc = sha1(`${id}${code}${date}`)

      var res = await 
      Axios({
        method: "POST",
        url: 'api/v3/im/get_students/' + id + '/' + code + '/' + enc,
        data: {
          name : studentName
        },
        transformRequest: [function (data) {
          let trans = ''
          for (let it in data) {
          trans += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
          return trans
        }],  
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      console.log(res.data)

      if (res.data.code == 404) {
        toastIt('查无此人')
        btnLogin.innerHTML = '查 询'
        btnLogin.disabled = false
        return
      } else if (res.data.code != 200) {
        toastIt(res.data.msg ? res.data.msg : '出错了，重新登录试试')
        btnLogin.innerHTML = '查 询'
        btnLogin.disabled = false
        return
      }

      btnLogin.style.display = "none"
      nameInput.style.display = "none"
      returnLogin.style.display = "block"
      this.$('.message-boxes').style.display = "block"

      this.state.isMounted && this.setState({
        studentMessage: res.data.data
      })
    }
    catch (e) {
      console.error(e)
      toastIt(e.message || '查询失败')
    }
    finally {
      btnLogin.innerHTML = '查 询'
      btnLogin.disabled = false
    }
  }

  componentWillUnmount() {
    this.state.isMounted = false
  }

  render() {
    var state = this.state
    return (
      <Trans className="find">
        <nav>
          找人
        </nav>
        <section className="main">
          <table className="message-boxes">   
            <thead>
              <tr>
                <th>姓名</th>
                <th>学院</th>
                <th>班级</th>
              </tr>
            </thead>
            <tbody> 
            {
              state.studentMessage.map((v, i) =>
                <tr key={ i }>
                  <td>{ v.TrueName }</td>
                  <td>{ v.dep_name }</td>
                  <td>{ v.class_name }</td>
                </tr>
              )
            }
            </tbody>
          </table>
          <div className="form">
            <input id="studentName" className="input" placeholder="姓 名" />
            <button id="btn-login" className="btn-login" onClick={ this.handleQuery }>
              查 询
            </button>
            <button id="return-login" className="btn-login return-login" onClick={ this.returnLogin }>
              返回查询
            </button>
          </div>
        </section>
      </Trans>
    )
  }
}
