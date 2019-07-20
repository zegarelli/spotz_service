// Verify Token
module.exports = function verifyToken (req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization']
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403) // Forbidden
  }
}
