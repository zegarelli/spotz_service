const { UnauthorizedError, PermissionError } = require('./errors')

module.exports = function (error, req, res, next) {
  // errors thrown by guard.js
  if (error instanceof PermissionError) {
    return res.status(403).json({
      error: 'Unauthorized',
      error_description: process.env.NODE_ENV === 'development'
        ? 'Not authorized to view this content'
        : null
    })
  } else if (error instanceof UnauthorizedError) {
    return res.status(401).json({
      error: 'Unauthorized',
      error_description: process.env.NODE_ENV === 'development'
        ? 'No authorization token was found'
        : null
    })
  } else {
    next(error)
  }
}
