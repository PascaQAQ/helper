import Trans from './trans'

import '../assets/css/library.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isWxProg: true }
  }

  componentDidMount() {
    if (window.__wxjs_environment === 'miniprogram') {
      this.setState({ isWxProg: true })
    } else {
      this.setState({ isWxProg: false })
    }

    document.querySelector('.btn-back').style.color = '#333'
    document.querySelector('nav').style.background = '#fff'
  }

  render() {
    return (
      <Trans className="library">
        <nav>
          图书馆
        </nav>
        {
          this.state.isWxProg ?
          <div className="img-box">
            因小程序限制，请直接访问HUT助手Web端: huthelper.cn
          </div> : 
          <iframe
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            src="http://218.75.197.122:8989/opac/weixin/account/service/index">
          </iframe>
        }
      </Trans>
    )
  }
}
