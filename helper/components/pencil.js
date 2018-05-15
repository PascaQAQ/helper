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
    if (window.__wxjs_environment === 'miniprogram') {
      toastIt('因小程序限制，请访问工大助手 Web 端：http://huthelper.cn', 5000)
    } else if (document.location.protocol == "https") {
       toastIt('请访问：http://huthelper.cn (是 http 不是 https)', 5000)
    }

    document.querySelector('.btn-back').style.color = '#333'
    document.querySelector('.pencil-header').style.background = '#fff'
  }

  render() {
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var date = dataformat('yyyy-mm')
    var enc = sha1(`${id}${code}${date}ASD!@#`)

    return (
      <Trans className="pencil">
      <header className="pencil-header"></header>
      {
        <iframe
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          src={ `http://hut.htmln.com:8888/api/v1/get/myhomework/${id}/${code}/${enc}` }>
        </iframe>
      }
      </Trans>
    )
  }
}
