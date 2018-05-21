// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import Document, { Head, Main, NextScript } from 'next/document'

var dev = process.env.NODE_ENV !== 'production'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    var buildId = this.props.__NEXT_DATA__.buildId
    var assetPrefix = this.props.__NEXT_DATA__.assetPrefix

    var fuckIE = 
    `<!--[if lt IE 10]>
      <h1 style="font-size: 80px; position: fixed; color: #000; background: #fff">
        此浏览器太旧，恕不奉陪
      </h1>
    <![endif]-->`

    return (
      <html lang='zh'>
        <Head>
          <title>新工大助手</title>
          <meta name="viewport" content="initial-scale=1, width=device-width, maximum-scale=1, user-scalable=no" />
          <meta name="format-detection" content="telephone=no"/>
          <meta name="apple-mobile-web-app-capable" content="yes"/>
          <meta name="screen-orientation" content="portrait" />
          <meta name="x5-orientation" content="portrait" />
          <meta name="browsermode" content="application" />
          <meta name="x5-page-mode" content="app" />
          <meta name="full-screen" content="yes" />
          <meta name="renderer" content="webkit" />

          <link rel="manifest" href="/manifest.json" />
          { 
            dev ?
            <link rel="stylesheet" href={ `/_next/static/style.css` } /> :
            <link rel="stylesheet" href={ `${assetPrefix}/_next/static/style-${buildId}.css` } />
          }
          <link rel="stylesheet" href="/static/css/fontello-5.18/css/fontello.css" />
          <link rel="dns-prefetch" href="https://api.huthelper.cn" />
          <link rel="preconnect" href="https://api.huthelper.cn" />
        </Head>
        <body>
          <div dangerouslySetInnerHTML={{ __html: fuckIE }} />
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
