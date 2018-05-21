const fs = require('fs')
const path = require('path')
const next = require('next')
const express = require('express')
const LRUCache = require('lru-cache')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dir: '.', dev })
const handle = app.getRequestHandler()

if (!dev) {
  const buildId = fs.readFileSync(path.join(__dirname, '.next', 'BUILD_ID'), 'utf8')
  fs.copyFileSync('.next/static/style.css', `.next/static/style-${buildId}.css`)
}

const ssrCache = new LRUCache({
  max: 10,
  maxAge: 1000 * 60 * 60 // 1 hour
})

app.prepare()
  .then(() => {
    const server = express()

    server.get('/', (req, res) => {
      // default: no-cache
      renderAndCache(req, res, '/')
    })

    server.get('/_next/on-demand-entries-ping', (req, res) => {
      return handle(req, res)
    })

    server.get('*', (req, res) => {
      if (!dev)
        res.setHeader('Cache-Control', 'public, max-age=31557600')

      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey (req) {
  return `${req.url}`
}

async function renderAndCache (req, res, pagePath, queryParams) {
  const key = getCacheKey(req)

  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT')
    res.send(ssrCache.get(key))
    return
  }

  try {
    // If not
    const html = await app.renderToHTML(req, res, pagePath, queryParams)

    if (res.statusCode !== 200) {
      res.send(html)
      return
    }

    ssrCache.set(key, html)

    res.setHeader('x-cache', 'MISS')
    res.send(html)
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams)
  }
}
