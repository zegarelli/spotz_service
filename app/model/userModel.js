'user strict'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var verifyUser = require('../middleware/verifyUser')
var client = require('./heroku_db')

var User = function (user) {
  this.username = user.username
  this.password = user.password
  this.hash = bcrypt.hash(user.password, 10) // Hash promise - requires .then when needed
  this.email = user.email
  this.token_payload = {
    username: user.username
  }
}

User.login = function login (userInfo, res) {
  verifyUser(userInfo, function (verErr, userId) {
    if (userId != null) {
      jwt.sign(userInfo.token_payload, process.env.SECRET, { expiresIn: '24h' }, function (err, token) {
        if (err) {
          console.log('error: ', err)
          res(err, null)
        } else {
          // User logged in!
          User.updateLastLogin(userId, function (err, userData) {
            if (err) {
              console.log('Error updating last login', err)
            } else {
              res(null, {
                userId: userId,
                bearer: token,
                account_created: userData.created_on
              })
            }
          })
        }
      })
    } else {
      console.log('Error verifying user: ', verErr)
      res('Error verifying user: ' + verErr, null)
      // Redirct method
    }
  })
}

User.updateLastLogin = function updateLastLogin (userId, result) {
  const text = 'UPDATE accounts set last_login = CURRENT_TIMESTAMP WHERE userId = $1 RETURNING *'
  var values = [userId]
  client.query(text, values, function (err, res) {
    if (err) {
      console.log('error: ', err)
      result(err, null)
    } else {
      result(null, res.rows[0])
    }
  })
}

User.register = function register (userInfo, result) {
  const text = 'INSERT INTO accounts(username, hash, email, created_on, last_login) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING userId'
  userInfo.hash.then(function (hash) {
    var values = [userInfo.username, hash, userInfo.email]
    client.query(text, values, function (err, res) {
      if (err) {
        console.log('error: ', err)
        result(err, null)
      } else {
        console.log('User:', res.rows[0].userId, 'created.')
        result(null, res.rows[0].userId)
      }
    })
  })
}

module.exports = User
