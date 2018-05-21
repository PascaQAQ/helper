import sha1 from 'sha1'
import Trans from './trans'
import store from '../store/index'
import dataformat from 'dateformat'
import { toastIt } from '../components/toast/toast'

import '../assets/css/pencil.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { url: '' }
  }

  componentDidMount() {
    document.querySelector('.btn-back').style.color = '#333'
    document.querySelector('.pencil-header').style.background = '#fff'

    if (window.__wxjs_environment !== 'miniprogram') {
      if (document.location.protocol == "https") {
        alert('请访问：http://huthelper.cn (是 http 不是 https)')
      }
    }
  }

  componentWillMount() {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var date = dataformat('yyyy-mm')
    var enc = sha1(`${id}${code}${date}ASD!@#`)

    if (window.__wxjs_environment === 'miniprogram') 
      this.state.url = `https://pic.htmln.com/api/v1/get/myhomework/${id}/${code}/${enc}`
    else
      this.state.url = `http://hut.htmln.com:8888/api/v1/get/myhomework/${id}/${code}/${enc}`
  }

  render() {
    return (
      <Trans className="pencil">
        <header className="pencil-header"></header>
        <iframe
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          src={ this.state.url }>
        </iframe>
      </Trans>
    )
  }
}
