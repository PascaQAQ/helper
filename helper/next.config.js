const withCss = require('@zeit/next-css')
const withLess = require('@zeit/next-less')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

module.exports = withLess(withCss(withBundleAnalyzer({
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),

  webpack(config, options) {
    const { isServer, dev } = options
    // options.extractCSSPlugin.filename = '../static/css/style.css'

    return config
  },

  generateEtags: false
})))
