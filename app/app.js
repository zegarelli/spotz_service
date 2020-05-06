const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const { userAuth } = require('./routes/authMiddle')

const usersRouter = require('./routes/users')
const placesRouter = require('./routes/places')
const activitiesRouter = require('./routes/activities')
const scopesRouter = require('./routes/scopes')
const commentsRouter = require('./routes/comments')

const config = require('./common/config')

const app = express()
app.set('view engine', 'ejs')

app.use(cors({
  origin: function (origin, callback) { // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (config.allowedOrigins.indexOf(origin) === -1) {
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

app.use(userAuth)

app.get('/', (req, res) => {
  res.render('index', config.siteConfig)
})

app.use('/users', usersRouter)
app.use('/places', placesRouter)
app.use('/activities', activitiesRouter)
app.use('/scopes', scopesRouter)
app.use('/comments', commentsRouter)

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
  res.sendStatus(err.status || 500)
})

module.exports = app
