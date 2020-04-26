const { decode } = require('../common/token')
const userService = require('../services/userService')

const userAuth = function (req, res, next) {
  const cookies = req.cookies
  if (!cookies || !cookies.id_token) {
    return next()
  }
  decode(cookies.id_token)
    .then(decodedToken => {
      if (!decodedToken) {
        console.log('Unable to decode JWT')
        return next()
      }
      userService.getUserScopes(decodedToken.email)
        .then(scopes => {
          req.user = { scopes }
          return next()
        })
        .catch((err) => {
          console.log('userService Error: ', err)
          return next()
        })
    }).catch((err) => {
      console.log('unable to decode JWT', err)
      return next()
    })
}

module.exports = {
  userAuth
}
