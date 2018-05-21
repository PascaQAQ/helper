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
  	var type = document.querySelector("#buy").checked ? 1 : 2
    
    var res = await Post({
      url: 'api/v3/trade/create/'
        + store.userData.data.studentKH + '/' + store.userData.data.remember_code_app,
      data: {
        tit: document.querySelector(".title").value,
        address: document.querySelector(".locate").value,
        prize: document.querySelector(".prize").value,
        content: document.querySelector('textarea').value,
        hidden: this.state.urls.join('//'),
        phone: document.querySelector(".phone").value,
        attr: document.querySelector(".attr").value,
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
          二手发布
          <i className="fa-ok create" onClick={ this.onCreate }/>
        </nav>
        <section className="content scroll">
          <div className="message">
            <p>添加标题</p>
            <input className="input title" placeholder="请输入标题"/>
          </div>

          <div className="message">
            <p>价格</p>
            <input className="input prize" placeholder="请输入价格"/>
          </div>

          <div className="message">
            <p>发布区域</p>
            <input className="input locate" placeholder="请输入区域"/>
          </div>

          <div className="message">
            <p>联系方式</p>
            <input className="input phone" placeholder="请输入联系方式"/>
          </div>
          
          <div className="message">
            <p>成色</p>
            <input className="input attr" placeholder="请输入成色"/>
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
            upURL={ store.picUpPrefix +  `/api/v3/upload/images/${id}/${code}/${enc}/1`} />
          </div>

          <div className="message">
            <p>发布类型</p>
            <div className="type">
              <input id="sell" name="sell" type="radio" name="ridao" defaultChecked />
              <label htmlFor="sell">出售</label>
              &nbsp;&nbsp;
              <input id="buy" name="buy" type="radio" name="ridao" />
              <label htmlFor="buy">求购</label>
            </div>
          </div>

        </section>
      </Trans>
    )
  }
}
