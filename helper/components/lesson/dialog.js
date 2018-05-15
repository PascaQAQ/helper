import ReactDOM from 'react-dom'
import dataformat from 'dateformat'
import store from '../../store/index'
import '../../assets/css/lesson/dialog.less'

export let dialog = (o, weekNo, week) => {
  var close = () => {
    document.querySelector('.weui-dialog').classList.add('weui-dialog--close')
    document.querySelector('.weui-mask').classList.add('weui-mask--close')
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(document.querySelector('#dialog'))
    }, 300)
  }

  var date = dataformat(
    store.beginLessonDate + ((weekNo - 1) * 7 + week - 1) * 24 * 3600 * 1000,
    'yyyy年mm月dd日'
  )

  ReactDOM.render(
    <div className="dialog">
      <div className="weui-mask" onClick={ close }></div>
      <div className="weui-dialog">
        <div className="weui-dialog__bd">
          <div>{ o.name }</div>
          <div>{ o.room }</div>
          <div>{ o.name ? o.teacher : '' }</div>

          <div>{ o.lesson ? '[实验]' + o.lesson : ''}</div>
          <div>{ o.obj }</div>
          <div>{ o.locate }</div>
          <div>{ o.lesson ? o.teacher : '' }</div>

          <div>{ date }</div>
        </div>
        <div className="weui-dialog__ft">
          <a className="weui-dialog__btn" onClick={ close }>
            确 定
          </a>
        </div>
      </div>
    </div>
    ,

    document.querySelector('#dialog'),

    () => setTimeout(() => {
      document.querySelector('.weui-mask').classList.add('weui-mask--open')
      document.querySelector('.weui-dialog').classList.add('weui-dialog--open')
    }, 16) 
  )
}
