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

module.exports = {
  UnauthorizedError,
  PermissionError
}
