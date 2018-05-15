import sha1 from 'sha1'
import React from 'react'
import store from '../store'
import Trans from './trans'
import dataformat from 'dateformat'
import Axios from '../assets/js/axios.util'
import { toastIt } from '../components/toast/toast'

import '../assets/css/power.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.handleQuery = this.handleQuery.bind(this)
    this.handleViewChange = this.handleViewChange.bind(this)
    this.$ = document.querySelector.bind(document)
    this.state = { isMounted: false, power: '', price: '', updateTime: '' }
  }

  handleViewChange(v) {
    this.props.onViewChange(v)
  }

  componentDidMount() {
    this.state.isMounted = true
    
    var res = JSON.parse(localStorage.getItem('power'))

    if (res) {
      this.$('#building-no').value = res.buildingNo
      this.$('#room-no').value = res.roomNo
      if (res.part == 1)
        this.$('#r-left').checked = true
      else
        this.$('#r-right').checked = true

      this.handleQuery()
    }
  }

  async handleQuery(e) {
    try {
      var buildingNo = this.$('#building-no').value.trim()
      var roomNo = this.$('#room-no').value.trim()
      var part = this.$('#r-left').checked ? '1' : '2'
      var btnLogin = this.$('#btn-login')

      if (!buildingNo || !roomNo) {
        toastIt('请输入宿舍楼号和寝室号，如 16 166')
        return
      }

      if (
        parseInt(buildingNo) + '' !== buildingNo || 
        parseInt(roomNo) + '' !== roomNo
      ) {
        toastIt('宿舍楼号和寝室号是数字，如 16 166')
        return
      }

      localStorage.setItem('power', JSON.stringify({ buildingNo, roomNo, part }))

      btnLogin.innerHTML = '正在查询...'
      btnLogin.disabled = true

      var id = store.userData.data.studentKH
      var code = store.userData.remember_code_app
      var date = dataformat('yyyy-mm')

      var enc = sha1(`${buildingNo}${roomNo}${date}${id}${code}`)

      var res = await 
      Axios.get(`/api/v3/get/power_e/${part}/${buildingNo}/${roomNo}/${id}/${code}/${enc}`)

      if (res.data.code !== 200) {
        toastIt(res.data.msg === '令牌错误' ? '请重新登录' : res.data.msg)
        btnLogin.innerHTML = '查 询'
        btnLogin.disabled = false
        return
      }

      if (
        res.data.code == 200 && 
        res.data.ammeter == '0.00' && 
        res.data.balance == '0.00'
      ) {
        toastIt('该寝室不存在或者数据还未同步，请稍后再试', 5000)
        btnLogin.innerHTML = '查 询'
        btnLogin.disabled = false
        return
      }
      
      this.state.isMounted && this.setState({
        power: `余电 ${res.data.ammeter}`,
        price: `余额 ${res.data.balance}`,
        updateTime: `数据抓取于 ${res.data.time}`
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
    return (
      <Trans className="power">
        <section className="form">
          <input id="building-no" className="input" placeholder="宿舍楼号" />
          <input id="room-no" className="input" placeholder="寝室号" />
          <section className="building-ad">
            <div>
              <input type="radio" id="r-left" defaultChecked="checked" name="radio" />
              <label htmlFor="r-left">西校区</label>
            </div>
            <div>
              <input type="radio" id="r-right" name="radio" />
              <label htmlFor="r-right">东校区</label>
            </div>
          </section>
          <button id="btn-login" className="btn-login" onClick={ this.handleQuery }>
            查 询
          </button>
        </section>
        <section className="show-power">
          <p>{ this.state.power }</p>
          <p>{ this.state.price }</p>
          <p className="update-on">{ this.state.updateTime } </p>
        </section>
      </Trans>
    )
  }
}
