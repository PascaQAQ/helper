import React from 'react'
import store from '../store/index'

import '../assets/css/all.less'
import '../assets/css/preview.less'

export default class extends React.Component {
  componentDidMount() {
    // setTimeout(() => {
    //   this.refs.trans.classList.add('trans-end')
    // }, 16)
  }

  render() {
    return (
      <div 
        ref="trans" 
        className={ (store.lastPage ? 'trans ' : '') + this.props.className }>
        { this.props.children }
      </div>
    )
  }
}
