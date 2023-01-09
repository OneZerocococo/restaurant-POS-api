if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(passport.initialize())

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

module.exports = app
