var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')

var usersRouter = require('./routes/users')
var placesRouter = require('./routes/places')
var activitiesRouter = require('./routes/activities')
var scopesRouter = require('./routes/scopes')

const { allowedOrigins } = require('./common/config')

var app = express()

app.use(cors({
  origin: function (origin, callback) { // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.'
      return callback(new Error(msg), false)
    } return callback(null, true)
  },
  credentials: true
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', usersRouter)
app.use('/places', placesRouter)
app.use('/activities', activitiesRouter)
app.use('/scopes', scopesRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.json(err)
  res.sendStatus(err.status || 500)
})

module.exports = app
