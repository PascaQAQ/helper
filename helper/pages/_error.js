import React from 'react'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }

  render() {
    return (
      <p>
        {this.props.statusCode
          ? `服务端渲染错误 (${this.props.statusCode})`
          : '客户端渲染错误'}
      </p>
    )
  }
}
