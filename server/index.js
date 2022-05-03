import express from 'express'
import bodyParser from 'body-parser'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import routes from './routes/index.js'

dotenv.config()
let secret = process.env.secret

const port = process.env.port

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

/* app.use((req, res, next)=> {
  console.log(req.method, req.url)
  next()
}) */

app.use(express.static('./public', {
  extensions: ['html']
}))

Object.values(routes).forEach(fn => app.use(fn))

const server = app.listen(port)
const io = new Server(server)

const activeUsers = {}

io.on('connection', socket => {
  socket.on('token', async token => {
    let payload = await jwt.verify(token, secret)
    let { user } = payload
    if (!activeUsers[user]) {
      socket.broadcast.emit('userJoined', user)
      console.log(user + ' connected')
      activeUsers[user] = {
        instances: {
          [socket.id]: socket
        }
      }

    } else {
      activeUsers[user].instances[socket.id] = socket
    }
    socket.user = user
    socket.emit('onlineList', Object.keys(activeUsers))
  })

  socket.on('disconnect', ()=> {
    let user = socket.user
    if (user && activeUsers[user]) {
      delete activeUsers[user].instances[socket.id]
      if (Object.keys(activeUsers[user].instances).length <= 0) {
        io.emit('userLeft', socket.user)
        console.log(socket.user + ' disconnected')
        delete activeUsers[user]
      }

    } else {
      console.log('wtf no user');
    }
  })

  socket.on('msg', msg => {
    console.log(socket.user + ': !@#$%^&*')
    // console.log(socket.user + ': ' + msg)
    socket.broadcast.emit('msg', msg, socket.user)
  })
})

console.log('Server listening on http://localhost:'+port)
