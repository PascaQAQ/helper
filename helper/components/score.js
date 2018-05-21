import Trans from './trans'
import store from '../store/index'
import dataformat from 'dateformat'
import Axios from '../assets/js/axios.util'
import { toastIt } from '../components/toast/toast'

import '../assets/css/score.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.gotoRank = this.gotoRank.bind(this)
    this.gotoBranch = this.gotoBranch.bind(this)
    this.state = { 
      rankList: [], 
      isMounted: false, 
      isQueried: false, 
      scoreList: [],
      isRank: true,
      activeGrade: ['term term-active', 'term', 'term', 'term', 'term'],
      grade: 0
    }
  }

  async componentDidMount() {
    try {
      this.state.isMounted = true

      var id = store.userData.data.studentKH
      var code = store.userData.remember_code_app
      var resRank
      var resScore
      
      resRank = await Axios.get(`api/v3/Get/rank/${id}/${code}`)
      if (resRank) {
        this.rankRefresh(resRank.data.rank.xqrank)
      }
      if (resRank.data.code === 401) {
        toastIt('请重新登录')
        return
      }
      if (!resRank.data.rank.xqrank) {
        toastIt('没有查到信息')
      }
      resScore = await Axios.get(`api/v3/Get/score/${id}/${code}`)
      if (resScore) {
        this.scoreRefresh(resScore.data.data)
      } 
      this.state.isMounted && this.setState({ isQueried: true })
    }
    catch (e) {
      console.error(e)
    }
  }

  componentWillUnmount() {
    this.state.isMounted = false
  }

  gotoRank() {
    this.state.isMounted && this.setState({ isRank: true })
  }

  gotoBranch() {
    this.state.isMounted && this.setState({ isRank: false })
  }
  
  rankRefresh(rank) {
    rank = rank
    .map(v => {
    	v.xn = v.xn+"学年"
      v.xq =  "第" + v.xq +"学期"
      return v
    })

    this.state.isMounted && this.setState({ rankList: rank })
  }
  
  scoreRefresh(score) {
  	let scoreNum = 0, gradeNum = 0, grade = score[0].xn
	  let scoreList = [], gradeList = [], length = 0
  	score = score
  	.map(v => {
	    if (v.xn == grade){
	      gradeList[scoreNum ++] = v
	      length ++
      }
	    else if (v.xn && v.xn != grade){
	    	scoreList = [ ...scoreList, gradeList ]
	      scoreNum = 0, gradeList = []
	      gradeList[scoreNum ++] = v, grade = v.xn
	      gradeNum ++, length ++
	    }
	    if (score.length == length ){
	    	scoreList = [ ...scoreList, gradeList ]
	    }
  	})
  	this.state.isMounted && this.setState(
      { scoreList: scoreList})
  }
  
  changeGrade(e) {
  	let activeGrade = ['term', 'term', 'term', 'term', 'term']
  	activeGrade[e] = 'term term-active'
  	this.state.isMounted && this.setState(
      { grade: e, activeGrade: activeGrade})
  }
  
  render() {
    var state = this.state
    var grade = state.grade
    var Rank = () =>
      <section className="totalScore-boxes rank">
        <header>
          <span className="title">所有成绩</span>
        </header>
        <div className="content scroll">
          { this.state.isQueried ? '' : <div className="query">正在加载...</div> }
          {
            state.rankList.map((v, i) => 
              <div className="totalScore-box" key = { i } >
                <div className="totalMessage">
                  <span>绩点</span>
                  <span className="totalNum">{ v.zhjd }</span>
                </div>
                <div className="totalMessage">
                  <span>班级排名</span>
                  <span className="totalNum">{ v.bjrank }</span>
                </div>
                <div className="totalMessage">
                  <span>专业排名</span>
                  <span className="totalNum">{ v.zyrank }</span>
                </div>
                <div className="totalMessage">
                  <span>平均分</span>
                  <span className="totalNum">{ v.pjf }</span>
                </div>
                <div className="totalMessage">
                  <span>{ v.xn }</span>
                  <span>{ v.xq }</span>
                </div>
              </div>
            )
          }
          {
        	state.rankList.length ?
        	<footer className="remarks"> 排名仅供参考 </footer> : ''
          }
        </div>
        <footer>
          <button 
            className="toBranch rank" 
            onClick={ () => this.gotoBranch() }>
            查看所有成绩
          </button>
        </footer>
      </section>

    var Branch = () => 
      <section className="branchScore-boxes scores">
        <header>
          <span className="title">所有成绩</span>
          <div className="terms">
            <div id="0" className={ state.activeGrade[0] } onClick = { e => this.changeGrade(e.target.id) } >大一</div>
            <div id="1" className={ state.activeGrade[1] } onClick = { e => this.changeGrade(e.target.id) } >大二</div>
            <div id="2" className={ state.activeGrade[2] } onClick = { e => this.changeGrade(e.target.id) } >大三</div>
            <div id="3" className={ state.activeGrade[3] } onClick = { e => this.changeGrade(e.target.id) } >大四</div>
            <div id="4" className={ state.activeGrade[4] } onClick = { e => this.changeGrade(e.target.id) } >其他</div>
          </div>
        </header>
        <div className="content"> 
          <div className="branchScore-box">
            <span className="class">课程</span>
            <span className="branchMessage">成绩</span>
            <span className="branchMessage">绩点</span>
            <span className="branchMessage">学分</span>
            <span className="branchMessage">性质</span>	      
          </div>
          {
            state.scoreList[grade]?
            state.scoreList[grade].map((v,i) =>
              <div className="branchScore-box" key = { i }>
                <span className="class">
                  { v.kcmc }             
                </span>
                <span className="branchMessage">
                  { v.zscj }
                </span>
                <span className="branchMessage">
                  { v.jd }
                </span>
                <span className="branchMessage">
                  { v.xf }
                </span>
                <span className="branchMessage">
                  { v.kcxz }
                </span>
              </div>
            ) : <div className="query">还没有该学年成绩</div>
          }
        </div>
        <footer>
          <button 
            className="toBranch scores" 
            onClick={ () => this.gotoRank() }>
            查看综合排名
          </button>
        </footer>
      </section>

    return (
      <Trans className="score">
        { this.state.isRank ? <Rank /> : <Branch /> }
      </Trans>
    )
  }
}
