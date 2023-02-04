if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const passport = require('./config/passport')
const routes = require('./routes')
const cors = require('cors')
const methodOverride = require('method-override')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', process.env.FRONTEND_ORIGIN]
  }
})
const port = process.env.PORT || 3000

app.use(cors({ origin: ['http://localhost:3000', process.env.FRONTEND_ORIGIN] }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use('/api', routes)
io.on('connection', socket => {
  socket.on('error', () => {
    socket.emit('fail connecting', 'Socket connected failed.')
  })
})
global.io = io

server.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
