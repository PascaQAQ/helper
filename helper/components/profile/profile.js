import Trans from '../trans'
import store from '../../store/index'
import { toastIt } from '../toast/toast'
import { viewer } from '../common/viewer'

import Axios from '../../assets/js/axios.util'

import '../../assets/css/profile/profile.less'

export default (props) => {
  var handleLogout = () => {
    localStorage.clear()
    props.onViewChange('login') 
  }

  var handleChange = async (v, name) => {
    if (v === null)
      return

    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app

    var data = { }
    data[name] = v

    var res = await Axios({
      method: 'POST',
      url: '/api/v3/set/profile/'
       + store.userData.data.studentKH + '/' + store.userData.data.remember_code_app,
      data: data,
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
      store.userData.data[name] = v
      document.querySelector('.v-' + name).innerHTML = v ? v : '未设置'
      localStorage.setItem('userData', JSON.stringify(store.userData))
      toastIt('已修改')
    } else {
      toastIt(res.data.msg ? res.data.msg : '修改出错')
      console.error(res.data)
    }
  }

  return (
    <Trans className="profile">
      <header className="header"></header>
      <section className="main">
        <img 
          width="80"
          height="80" 
          src={ store.picPrefix + store.userData.data.head_pic_thumb } 
          alt="图裂开了"
          onClick={ () => viewer(
            store.picPrefix + store.userData.data.head_pic_thumb,
            store.picPrefix + store.userData.data.head_pic,
          ) } />
        <div className="name">{ store.userData.data.TrueName || '某人' }</div>
        <div className="class">{ store.userData.data.dep_name || '' }</div>
      </section>
      <section className="body">
        <section className="opts">
          <div className="opt" onClick={ () => props.onViewChange('#changePic') }>
            <span>头 像</span>
            <span className="val">点击修改</span>
          </div>
          <div className="opt" onClick={ () => handleChange(
            prompt('输入昵称', store.userData.data.username), 'username'
          ) }>
            <span>昵 称</span>
            <span className="v-username val">{ store.userData.data.username || '未设置' }</span>
          </div>
          <div className="opt" onClick={ () => handleChange(
            prompt('个性签名将被公开，也可填联系方式等', store.userData.data.bio), 'bio'
          ) }>
            <span>个性签名</span>
            <span className="v-bio val">{ store.userData.data.bio || '未设置' }</span>
          </div>
        </section>
        <section className="about">
          <p>
          新工大助手
          </p>
          <p>
            Web 端：
            <a target="_blank" href="http://huthelper.cn">huthelper.cn</a>
          </p>
          <p>
            可添加到桌面，方便下次访问
          </p>
        </section>
        <footer className="footer">
          <a 
          className="reset"
          onClick={ handleLogout }>
            切换账号
          </a>
          &nbsp; &nbsp;
          <a 
          className="reset"
          onClick={ () => toastIt('请关注「HUT助手」公众号，直接留言反馈', 5000) }>
            联系开发者
          </a>
        </footer>
      </section>
    </Trans>
  )
}
