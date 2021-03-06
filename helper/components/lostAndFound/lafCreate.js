import sha1 from 'sha1'
import React from 'react'
import Trans from '../trans'
import dataformat from 'dateformat'
import store from '../../store/index'
import Upload from '../common/upload'
import Post from '../../assets/js/post.util'
import { toastIt } from '../../components/toast/toast'

import '../../assets/css/lostAndFound/lafCreate.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.onCreate = this.onCreate.bind(this)
    this.onPicChange = this.onPicChange.bind(this)
    this.state = { 
    	urls: [ ] , 
    	mouth: Array(12).fill().map((v, i) => i > 8 ? (i + 1) : '0' + (i + 1)),
    	day: Array(31).fill().map((v, i) => i > 8 ? (i + 1) : '0' + (i + 1)),
    	hour: Array(23).fill().map((v, i) => i > 8 ? (i + 1) : '0' + (i + 1)),
    }
  }

  componentDidMount() {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app

    document.querySelector('.btn-back').style.color = '#333'
  }

  onPicChange(urls) {
    this.state.urls = urls
  }

  async onCreate() {
  	var type = document.querySelector("#found").checked ? 1 : 2
  	var mouthObject = document.querySelector(".selMouth")
  	var dayObject = document.querySelector(".selDay")
  	var dateObject = document.querySelector(".selTime")
  	var hourObject = document.querySelector(".selHour")
	  var time =
    new Date().getFullYear() + '-' + 
    mouthObject.options[mouthObject.selectedIndex].text + '-' + 
    dayObject.options[dayObject.selectedIndex].text + ' ' +
    hourObject.options[hourObject.selectedIndex].text + ':00:00'
    
    var res = await Post({
      url: 'api/v3/Loses/create/'
        + store.userData.data.studentKH + '/' + store.userData.data.remember_code_app,
      data: {
        tit: document.querySelector(".title").value,
        locate: document.querySelector(".locate").value,
        time: time,
        content: document.querySelector('textarea').value,
        hidden: this.state.urls.join('//'),
        phone: document.querySelector(".phone").value,
        type: type
      }
    })
    
    if (res.data.code == 200) {
      toastIt('成功发布')
      history.back()
    } else if (res.data.code == 401) {
      toastIt('请重新登录')
    } else {
      toastIt(res.data.msg)
    }
  }

  render() {
    var state = this.state
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var date = dataformat('yyyy-mm')
    var enc = sha1(`${id}${code}${date}`)

    return (
      <Trans className="lafCreate">
        <nav> 
          发布
          <i className="fa-ok create" onClick={ this.onCreate }/>
        </nav>
        <section className="content scroll">
          <div className="message">
            <p>拾到物品</p>
            <input className="input title" placeholder="请输入物品名"/>
          </div>

          <div className="message">
            <p>拾到地点</p>
            <input className="input locate" placeholder="请输入地点"/>
          </div>

          <div className="message">
            <p>联系方式</p>
            <input className="input phone" placeholder="请输入联系方式"/>
          </div>

          <div className="message">
            <p>详情</p>
            <textarea 
              spellCheck="false" autoComplete="false" 
              rows="3" placeholder="输入详情...">
            </textarea>
          </div>

          <div className="message">
            <p>图片</p>
            <Upload 
            className="upload" max="6" onChange={ this.onPicChange }
            upURL={ store.picUpPrefix +  `/api/v3/upload/images/${id}/${code}/${enc}/2`} />
          </div>

          <div className="message">
            <p>拾到时间</p>

            <select className="selMouth">
              { state.mouth.map((v, i) => <option key={ i } >{ v }</option>) }
            </select>
            <span className="opt-title">月</span>

            <select className="selDay">
              { state.day.map((v, i) => <option key={ i }>{ v }</option>) }
            </select>
            <span className="opt-title">日</span>

            <select className="selHour">
              <option>00</option>
              { state.hour.map((v, i) => <option key={ i }>{ v }</option>) }
            </select>
            <span className="opt-title">时</span>
          </div>

          <div className="message">
            <p>发布类型</p>
            <div className="type">
              <input id="found" name="found" type="radio" name="ridao" defaultChecked />
              <label htmlFor="found">招领</label>
              &nbsp;&nbsp;
              <input id="lost" name="lost" type="radio" name="ridao" />
              <label htmlFor="lost">遗失</label>
            </div>
          </div>

        </section>
      </Trans>
    )
  }
}
