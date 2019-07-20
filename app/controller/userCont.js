'use strict'

var User = require('../model/userModel')

exports.login = function (req, res) {
  var userInfo = new User(req.body)

  User.login(userInfo, function (err, userToken) {
    if (err) {
      res.send(err)
    } else {
      console.log(userInfo.username, ' logged in.')
      res.json(userToken)
    }
  })
}

exports.register = function (req, res) {
  var userInfo = new User(req.body)

  User.register(userInfo, function (err, userId) {
    if (err) {
      if (err.detail.startsWith('Key (username)=')) { // Username already exists
        res.send('Username already exists, please pick another')
      } else if (err.detail.startsWith('Key (email)=')) {
        res.send('An account with that email already exists')
        // Maybe redirect to forgot password portal?
      } else {
        res.send(err) // Something else happened, send them full err
      }
    } else {
      User.login(userInfo, function (err, userToken) {
        if (err) {
          res.send(err)
        } else {
          console.log(userInfo.username, ' logged in.')
          res.json(userToken)
        }
      })
    }
  })
}
