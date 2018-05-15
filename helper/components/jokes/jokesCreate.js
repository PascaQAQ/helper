import React from 'react'
import Trans from '../trans'
import store from '../../store/index'
import Upload from '../common/upload'
import Axios from '../../assets/js/axios.util'
import { toastIt } from '../../components/toast/toast'

import '../../assets/css/jokes/jokesCreate.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.onCreate = this.onCreate.bind(this)
    this.onPicChange = this.onPicChange.bind(this)
    this.state = { urls: [ ] }
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
    var res = await Axios({
      method: 'POST',
      url: '/api/v3/statement/create/'
       + store.userData.data.studentKH + '/' + store.userData.data.remember_code_app,
      data: {
        content: document.querySelector('textarea').value,
        user_id: store.userData.data.user_id,
        hidden: this.state.urls.join('//')
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
      history.back()
    } else if (res.data.code == 401) {
      toastIt('请重新登录')
    } else {
      toastIt(res.data.msg)
    }
  }

  render() {
    return (
      <Trans className="jokes-create">
        <header>发布</header>
        <section className="content">
          <textarea 
            spellCheck="false" autoComplete="false" 
            rows="6" placeholder="输入...">
          </textarea>
          <Upload className="upload" max="6" onChange={ this.onPicChange } />
          <footer>
            <button id="btn-login" className="btn-login" onClick={ this.onCreate }>
              发布
            </button>
          </footer>
        </section>
      </Trans>
    )
  }
}
