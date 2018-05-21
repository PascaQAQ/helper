import Trans from '../trans'
import store from '../../store/index'
import Axios from '../../assets/js/axios.util'
import { toastIt } from '../../components/toast/toast'
import { dialog } from './dialog'

import '../../assets/css/lesson/lesson.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.prev       = this.prev.bind(this)
    this.next       = this.next.bind(this)
    this.refresh    = this.refresh.bind(this)
    this.state      = { isMounted: false, list: [ ], weekNumber: store.weekNumber }
    this.backExp    = 'rgba(230, 204, 255, .8)'
    this.backColors = [
      'rgba(254, 202, 174, .8)', 
      'rgba(110, 202, 174, .8)', 
      'rgba(148, 201, 171, .8)', 
      'rgba(172, 195, 98, .8)'
    ]
  }
  
  componentWillMount() {
    this.state.isMounted = true

    this.refresh(store.weekNumber)
  }

  refresh(weekNumber, useCache = true) {
    var id     = store.userData.data.studentKH
    var code   = store.userData.remember_code_app
    var map    = Array(5).fill().map(v => Array(7).fill().map(u => ({ })))
    var mapExp = Array(5).fill().map(v => Array(7).fill().map(u => ({ })))
    var mapT   = Array(5).fill().map(v => Array(7).fill().map(u => ({ })))

    if (!useCache)
      this.state.isMounted && this.setState({ list: mapT })

    var load = (type, url, f) => {
      if (useCache) {
        var lesson = JSON.parse(localStorage.getItem('lesson' + type))
        if (lesson) {
          f({ data: lesson })
          return
        }
      }
      
      Axios.get(url)
      .then(res => {
        if (res.data.code != 200) {
          if (res.data.code == 401) {
            toastIt('请重新登录')
            return
          }
          if (type === 1) {
            toastIt('课表: ' + res.data.msg, 3500)
            return
          }
          if (type === 2) {
            if (res.data.code != 404)
              toastIt('实验课表: ' + res.data.msg, 5000)
            else
              localStorage.setItem('lesson' + type, JSON.stringify({ data: [ ] }))
              
            return
          }
        } else
          localStorage.setItem('lesson' + type, JSON.stringify(res.data))

        f(res)
      })
      .catch(e => {
        console.error(e)
        if (type === 1)
          toastIt('课表未能获取: ' + e.message, 3500)
        if (type === 2) {
          localStorage.setItem('lesson' + type, JSON.stringify({ data: [ ] }))
          alert('因学校服务器问题，实验课表未能获取，请稍后点击课表右上角的按钮刷新')
        }
      })
    }

    load(1, `/api/v3/get/schedule/${id}/${code}`, (res) => {
      var names = Array.from(new Set(res.data.data.map(v => v.name || v.lesson))).sort()

      for (var v of res.data.data) {
        if (v.qsz > weekNumber || v.jsz < weekNumber) continue
        if (v.dsz == 1 && weekNumber % 2 == 0) continue
        if (v.dsz == 2 && weekNumber % 2 != 0) continue
  
        v.color = this.backColors[names.indexOf(v.name) % (this.backColors.length)]
        v.type = 'lesson'
  
        map[Math.ceil(v.djj / 2) - 1][v.xqj - 1] = v
      }
  
      this.combine(mapT, map)
    })

    load(2, `/api/v3/home/lessonsExp_Wechat/${id}/${code}`, (res) => {
      for (var v of res.data.data) {
        if (v.weeks_no != weekNumber) continue

        v.color = this.backExp
        v.type = 'lessonExp'

        mapExp[v.lesson_no - 1][v.week - 1] = v
      }

      this.combine(mapT, mapExp)
    })
  }

  combine(t, a) {
    var add = t.map((v, i) => v.map((u, j) => Object.assign(u, a[i][j])))

    this.state.isMounted && this.setState({ list: add })
  }

  prev() {
    var gotoWeek = this.state.weekNumber - 1
    if (this.state.weekNumber === 1)
      gotoWeek = 20

    this.refresh(gotoWeek)
    this.setState({ weekNumber: gotoWeek })
  }

  next() {
    var gotoWeek = this.state.weekNumber + 1
    if (this.state.weekNumber === 20)
      gotoWeek = 1

    this.refresh(gotoWeek)
    this.setState({ weekNumber: gotoWeek })
  }

  componentWillUnmount() {
    this.state.isMounted = false
  }

  render() {
    return (
      <Trans className="lesson">
        <header>
          <div className="btn" onClick={ this.prev.bind(this) }>上一周</div>
          <div>第 { this.state.weekNumber } 周</div>
          <div className="btn" onClick={ this.next.bind(this) }>下一周</div>
          <div 
            className="refresh btn" 
            onClick={ this.refresh.bind(this, this.state.weekNumber, false) }>
            <i className="fa fa-arrows-cw"></i>
          </div>
        </header>
        <section className="main scroll">
          <table>
            <thead>
              <tr>
                <th>&nbsp;</th>
                { store.weeks.map((v, i) => <th key={ i }>{ v }</th> ) }
              </tr>
            </thead>
            <tbody> 
            {
              this.state.list.map((v, i) => 
                <tr key={ i }>
                  <td className="no">{ 2 * (i + 1) - 1 }<br />{ 2 * (i + 1) }</td> 
                  {
                    v.map((u, j) => 
                      <td 
                        className={
                          u.lesson && (u.lesson + u.obj).length > 15 ? 'item sm' : 'item' 
                        }
                        onClick={ () => dialog(u, this.state.weekNumber, j + 1) }
                        style={ u.color ? { 'backgroundColor': u.color } : { } }
                        key={ j }>
                        { u.color && u.name ? u.name : '' }
                        <div>{ u.color && u.name ? (u.room) : '' }</div>
                        { u.color && u.lesson ? '[实验]' + u.lesson + ' ' + u.obj : '' }
                        <div>{ u.color && u.lesson ? u.locate : '' }</div>
                      </td>
                    )
                  }
                </tr>
              )
            }
            </tbody>
          </table>
        </section>
      </Trans>
    )
  }
}
