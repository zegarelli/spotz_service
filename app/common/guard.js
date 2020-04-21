const { UnauthorizedError, PermissionError } = require('./errors')
const { decode } = require('../common/token')
const userService = require('../services/userService')

const guard = (function () {
  let config = {
    requestProperty: 'cookies',
    permissionsProperty: 'id_token'
  }
  if (process.env.SECURITY_OFF && process.env.SECURITY_OFF.toLowerCase() === 'true' && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')) {
    config.securityOff = true
  }

  function options (configData) {
    config = Object.assign({}, config, configData)
    return config
  }

  function createMiddleware (options, requiredPermissions, sufficientCheck) {
    return function middleware (req, res, next) {
      if (options.securityOff === true) { // be explicit so we don't accept strings or other objects
        return next(null)
      }
      if (!options.requestProperty) {
        return next(new UnauthorizedError('Guard requestProperty hasn\'t been defined. Check your configuration.'))
      }
      const cookies = req[options.requestProperty]
      if (!cookies) {
        return next(new UnauthorizedError(`cookies object ${options.requestProperty} was not found. Check your configuration.`))
      }
      const idToken = cookies[options.permissionsProperty]
      if (!idToken) {
        return next(new UnauthorizedError('Could not find id_token in cookies. Bad configuration?'))
      }
      decode(idToken)
        .then(decodedToken => {
          if (!(decodedToken)) {
            return next(new UnauthorizedError('Unable to decode JWT'))
          }
          userService.getUserScopes(decodedToken.email)
            .then(permissions => {
              const sufficient = sufficientCheck(requiredPermissions, permissions)
              return next(!sufficient ? new PermissionError('insufficient permissions') : null)
            })
            .catch((err) => {
              console.log('userService Error: ', err)
            })
        }).catch((err) => {
          console.log(err)
          return next(new UnauthorizedError('Unable to decode JWT'))
        })
    }
  }

  function checkAll (required) {
    if (typeof required === 'string') required = [required]
    return createMiddleware(config, required, (required, actual) => {
      return required.every(permission => {
        return actual.indexOf(permission) !== -1
      })
    })
  }

  function checkAny (required) {
    if (typeof required === 'string') required = [required]
    return createMiddleware(config, required, (required, actual) => {
      return required.some(permission => {
        return actual.indexOf(permission) !== -1
      })
    })
  }

  return {
    options,
    checkAll,
    checkAny
  }
})()

module.exports = guard
