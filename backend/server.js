/**
 * @author William Westerlund, Alexandra Hotti
 */

require('better-logging')(console)
const expressSession = require('express-session')
const sharedSession = require('express-socket.io-session')
const express = require('express')
const http = require('http')

const hash = 'EDEB7432C672677B1A186624BD4EF5CB'
const passport = require('passport')

/**
 * This function sets up some boilerplate for express and socket.io
 * - Creates express app
 * - Creates socket.io app
 * - Logs all incoming requests
 * - Serves static files from ../public/* at /
 * - Parses request-body & request-url
 * - Adds a cookie based session storage to both express & socket.io
 *
 * @returns ctx: { app: ExpressApp, io: SocketIOApp, listen: (port, callback) => void }
 */
module.exports = () => {
  const app = express() // Creates express app
  const httpServer = http.Server(app) // Express usually does this for us, but socket.io needs the httpServer directly
  // Creates socket.io app
  const io = require('socket.io').listen(httpServer) // eslint-disable-line global-require

  // Setup express
  app.use((req, res, next) => {
    // Logs each incoming request
    console.info(`${console.color.Dark_Gray} ${req.ip} ${console.color.RESET} ${req.path} ${req.body || ''}`)
    next()
  })
  app.use(
    express.json() /*
        This is a middleware, provided by express, that parses the body of the request into a javascript object.
        It's basically just replacing the body property like this:
        req.body = JSON.parse(req.body)
    */
  )
  app.use(
    express.urlencoded({
      extended: true
    })
  )
  // app.use(express.static(path.join(__dirname, '..', '..', 'public')) /*
  //     express.static(absolutePathToPublicDirectory)
  //     This will serve static files from the public directory, starting with index.html
  // */);

  // Setup session
  const session = expressSession({
    secret: hash,
    cookie: { secure: false, maxAge: 4 * 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: true
  })
  app.use(session)
  io.use(sharedSession(session))

  app.use(passport.initialize())
  app.use(passport.session())

  require('./config/passport')(passport) // eslint-disable-line global-require

  return {
    app,
    io,
    listen: (port, cb) => httpServer.listen(port, cb)
  }
}
