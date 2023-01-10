if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const passport = require('./config/passport')
const routes = require('./routes')
const cors = require('cors')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000

app.use(cors({ origin: [`http://localhost:${port}`, process.env.FRONTEND_ORIGIN] }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(passport.initialize())

app.use('/api', routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

module.exports = app
