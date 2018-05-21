import Trans from './trans'

import '../assets/css/library.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.querySelector('.btn-back').style.color = '#333'
    document.querySelector('nav').style.background = '#fff'
    
    if (window.__wxjs_environment !== 'miniprogram') {
      if (document.location.protocol == "https") {
        alert('请访问：http://huthelper.cn (是 http 不是 https)')
      }
    }
  }

  render() {
    return (
      <Trans className="library">
        <nav>
          图书馆
        </nav>
        <iframe
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          src="http://218.75.197.122:8989/opac/weixin/account/service/index">
        </iframe>
      </Trans>
    )
  }
}
