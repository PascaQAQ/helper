import Trans from './trans'
import Head from 'next/head'
import Link from 'next/link'
import store from '../store'
import dataformat from 'dateformat'
import Axios from '../assets/js/axios.util'

import '../assets/css/home.less'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.handleViewChange = this.handleViewChange.bind(this)
    this.state = { timeLine: [], timeText: '' }
  }

  componentWillMount() {
    this.state.timeText = dataformat('m月d日 ') + '第' + store.weekNumber + '周 周' + 
    store.weeks[parseInt(dataformat('N')) - 1]

    this.state.timeLine = store.calendar.map(v => ({ 
      date: v[1].replace(/-/g, '.'), 
      name: v[0], 
      days: Math.round(((Date.parse(v[1]) - (new Date()).getTime())) / 24 / 3600 / 1000)
     }))
  }

  handleViewChange(v) {
    this.props.onViewChange(v)
  }

  render() {
    return (
      <Trans className="home">
        <header className="header">
          <a className="user" onClick={ this.handleViewChange.bind(this, '#profile') }>
            <i className="fa fa-user-o" ></i>
          </a>
          <a className="refresh" onClick={ () => location.reload(true) }>
            <i className="fa fa-arrows-cw"></i>
          </a>
          <section className="week">
            { this.state.timeText }
          </section>
          <section className="timeline-warp">
            <i className="clock fa fa-clock"></i>
            <section className="timeline">
            {
              this.state.timeLine.map((v, i) => 
                <div className="date-group" key={ i }>
                  <div className="date">{ v.date }</div>
                  <div className={ i ? 'dot' : 'dot dot-first' }></div>
                  <div className="date-content">{ `${v.name} ${v.days} 天` }</div>
                </div>
              )
            }
            </section>
          </section>
        </header>
        
        <section className="funcs">
        {
          store.btnItems.map((v, i) =>
            <div className="item-warp" key={ i }>
              <a 
                className="item"
                onClick={ this.handleViewChange.bind(this, '#' + v.page) }>
                <i className={ `fa fa-${v.class}` }></i>
                <span className="item-name">{ v.name }</span>
              </a>
            </div>
          )
        }
        </section>
      </Trans>
    )
  }
}
