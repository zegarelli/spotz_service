class UnauthorizedError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.statusCode = 401
  }
}

class PermissionError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.statusCode = 403
  }
}

class TokenError extends Error {
  constructor (message, err) {
    super(message)
    this.message = message
    this.statusCode = 401
    this.err = err
  }
}

module.exports = {
  UnauthorizedError,
  PermissionError,
  TokenError
}
