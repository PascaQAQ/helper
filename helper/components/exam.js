import Trans from './trans'
import store from '../store/index'
import dataformat from 'dateformat'
import Axios from '../assets/js/axios.util'
import { toastIt } from '../components/toast/toast'

import '../assets/css/exam.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isMounted: false, examList: [ ], isQueried: false }
  }

  async componentDidMount() {
    try {
      this.state.isMounted = true

      var id = store.userData.data.studentKH
      var code = store.userData.remember_code_app

      var resExam = JSON.parse(localStorage.getItem('exam'))
      var hasCache = !!resExam

      if (resExam) {
        this.refresh(resExam.res.exam)
      }
      
      resExam = await 
      Axios.get(`/api/v3/home/examination_wechat/${id}/${code}`)

      if (resExam.data.code === 401) {
        toastIt('请重新登录')
        return
      }
      
      if (resExam.data.code !== 100) {
        hasCache ? 
        toastIt('未能查询到数据，使用缓存的数据', 5000) : 
        toastIt('未能查询到数据，请以学校通知为准', 5000)
        return
      }

      if (!resExam.data.res.exam.length) {
        toastIt('没有查到考试信息，请以学校通知为准')
      }

      localStorage.setItem('exam', JSON.stringify(resExam.data))

      this.refresh(resExam.data.res.exam)

      this.state.isMounted && this.setState(
        { isQueried: true }
      )
    }
    catch (e) {
      console.error(e)
      hasCache ? 
      toastIt('未能查询到考试，使用缓存的数据（' + e.message + '）', 5000) : 
      toastIt('未能查询到考试（' + e.message + '）', 5000)
    }
  }

  refresh(exam) {
    exam = exam
    .map(v => {
      v.date      = dataformat(Date.parse(v.Starttime.split(' ').shift()), 'yyyy.mm.dd')
      v.startHour = v.Starttime.split(' ').pop().substr(0, 5)
      v.endHour   = v.EndTime.split(' ').pop().substr(0, 5)
      v.week      = dataformat(Date.parse(v.Starttime.split(' ').shift()), 'N')
      v.weekName  = `第${v.Week_Num}周`
      v.hourLeft   = 
      (Date.parse(v.Starttime) - (new Date()).getTime())
      / (3660 * 1000)
      v.dayText = v.hourLeft >= 0 ? `${Math.floor(v.hourLeft / 24)} 天` : '已结束'
      v.hourText = v.hourLeft >= 0 ? `${Math.floor(v.hourLeft % 24)} 时` : ''

      if (v.dayLeft < 0) v.dayLeft = 10000

      return v
    })
    .sort((a, b) => {
      if (a.hourLeft !== b.hourLeft)
        return a.hourLeft > b.hourLeft
      else
        return Date.parse(a.Starttime) > Date.parse(b.Starttime)
    })

    this.state.isMounted && this.setState(
      { examList: exam }
    )
  }

  componentWillUnmount() {
    this.state.isMounted = false
  }

  render() {
    return (
      <Trans className="exam">
        <header>
          考试计划
        </header>
        <section className="inner">
          { this.state.isQueried ? '' : <div className="query">正在查询...</div> }
          {
            this.state.examList.map((v, i) => 
              <div className="item" key={ i }>
                <div>
                  <h1>{ v.date + ' ' +  v.weekName + ' 周' + store.weeks[v.week - 1] }</h1>
                  <h1>{ v.startHour + '-' + v.endHour }</h1>
                  <h3>{ v.CourseName }</h3>
                  <h3>{ v.RoomName }</h3>
                </div>
                <div className="time-left">
                  <div>
                    { v.dayText }
                  </div>
                  <div className="hour-left">
                    { v.hourText }
                  </div>
                </div>
              </div>
            )
          }
          { 
            this.state.examList.length ? 
            <footer>最终考试的时间地点请以考试执行表为准</footer> : ''
          }
        </section>
      </Trans>
    )
  }
}
