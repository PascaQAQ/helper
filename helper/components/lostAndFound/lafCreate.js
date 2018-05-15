import React from 'react'
import Trans from '../trans'
import store from '../../store/index'
import Upload from '../common/upload'
import Axios from '../../assets/js/axios.util'
import { toastIt } from '../../components/toast/toast'

import '../../assets/css/lostAndFound/lafCreate.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.onCreate = this.onCreate.bind(this)
    this.onPicChange = this.onPicChange.bind(this)
    this.state = { 
    	urls: [ ] , 
    	mouth: ["01","02","03","04","05","06","07","08","09","10","11","12"],
    	day: ["01","02","03","04","05","06","07","08","09","10","11","12","13",
    	"14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]  	
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
	  var time =
	  new Date().getFullYear() + "-" + mouthObject.options[mouthObject.selectedIndex].text 
	  + "-" + dayObject.options[dayObject.selectedIndex].text 
    var res = await Axios({
      method: 'POST',
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
    
    if (res.data.code == 200) {
      toastIt('成功发布')
      this.props.onViewChange('lostAndFound')
    } else if (res.data.code == 401) {
      toastIt('请重新登录')
    } else {
      toastIt(res.data.msg)
    }
  }

  render() {
  	var state = this.state
    return (
      <Trans className="lafCreate">
        <nav> 
          发布
          <i className="fa-ok create" onClick={ this.onCreate }/>
        </nav>
        <section className="content">
          <div className="content-top">     
            <textarea 
              spellCheck="false" autoComplete="false" 
              rows="6" placeholder="输入...">
            </textarea>
            <Upload className="upload" max="6" onChange={ this.onPicChange } />
          </div>
          <div className="content-bot">
            <div className="message">
              <p>拾到物品</p>
              <input className="title" placeholder="请输入物品名"/>
            </div>
            <div className="message">
              <p>拾到地点</p>
              <input className="locate" placeholder="请输入地点"/>
            </div>
            <div className="message">
              <p>联系方式</p>
              <input className="phone" placeholder="请输入联系方式"/>
            </div>
            <div className="message">
              <p>拾到时间</p>
              <select className="selMouth">
                <option>月份</option>
                {
                	state.mouth.map((v,i) =>
                	  <option key = { i } > { v } </option>
                	)
                }
              </select>
              <select className="selDay">
                <option>日期</option>
                {
                	state.day.map((v,i) =>
                	  <option key = { i } > { v } </option>
                	)
                }
              </select>
            </div>
            <div className="type">
              <input id="found" type="radio" name="ridao" />招领
              <input id="lost" type="radio" name="ridao" />遗失
            </div>
          </div>
        </section>
      </Trans>
    )
  }
}
