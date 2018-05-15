import sha1 from 'sha1'
import React from 'react'
import Trans from '../trans'
import store from '../../store/index'
import Upload from '../common/upload'
import dataformat from 'dateformat'
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
    document.querySelector('.btn-back').style.color = '#333'
  }

  componentWillUnmount() {
    document.querySelector('.btn-back').style.color = '#fff'
  }

  onPicChange(urls) {
    this.state.urls = urls
  }

  async onCreate() {
    if (this.state.urls.length <= 0) {
      toastIt('请选择头像')
      return
    }
    store.userData.data.head_pic_thumb = this.state.urls[0]
    store.userData.data.head_pic = 
    store.userData.data.head_pic_thumb.replace(/_thumb/, '')

    localStorage.setItem('userData', JSON.stringify(store.userData))
    
    history.back()
  }

  render() {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var date = dataformat('yyyy-mm')
    var enc = sha1(`${id}${code}${date}`)

    return (
      <Trans className="jokes-create">
        <header>修改头像</header>
        <section className="content">
          <Upload 
            className="upload" 
            max="1" 
            upURL={ store.picUpPrefix + `/api/v3/upload/images/${id}/${code}/${enc}/3` }
            onChange={ this.onPicChange } />
          <footer>
            <button id="btn-login" className="btn-login" onClick={ this.onCreate }>
              确定
            </button>
          </footer>
        </section>
      </Trans>
    )
  }
}
