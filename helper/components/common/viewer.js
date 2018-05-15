import ReactDOM from 'react-dom'
import store from '../../store/index'
import { toastIt } from '../../components/toast/toast'

import '../../assets/css/common/viewer.less'

export let viewer = (url, urlOri) => {
  var close = () => {
    document.querySelector('.weui-dialog').classList.add('weui-dialog--close')
    document.querySelector('.weui-mask').classList.add('weui-mask--close')
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(document.querySelector('#dialog'))
    }, 300)
  }

  ReactDOM.render(
    <div className="viewer">
      <div className="weui-mask" onClick={ close }></div>
      <div className="weui-dialog" onClick={ close }>
        <img className="img-thumb" src={ url } style={{ display: 'none' }} />
        <img 
          className="img-ori" src={ urlOri } 
          onLoad={ e => document.querySelector('.load-ori').style.display = 'none' }
          onError={ e => {
            document.querySelector('.img-thumb').style.display = 'block' 
            document.querySelector('.load-ori').style.display = 'none'
            e.target.style.display = 'none'
            // toastIt('原图无法加载，显示缩略图')
          }} />
      </div>
      <span className="load-ori">加载原图...</span>
    </div>
    ,

    document.querySelector('#dialog'),

    () => setTimeout(() => {
      document.querySelector('.weui-mask').classList.add('weui-mask--open')
      document.querySelector('.weui-dialog').classList.add('weui-dialog--open')
    }, 16) 
  )
}
