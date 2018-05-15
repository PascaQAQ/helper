const express = require('../node_modules/express')
const app = express()

app.get('*', (req, res) => {
  console.log(req.url)
  res.send('Hello World!\n')
})

app.listen(3010, () => console.log('Example app listening on port 3010!'))
