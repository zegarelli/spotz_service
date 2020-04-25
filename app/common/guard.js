const { UnauthorizedError, PermissionError } = require('./errors')

const guard = (function () {
  let config = {
    requestProperty: 'user',
    permissionsProperty: 'scopes'
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
      const user = req[options.requestProperty]
      if (!user) {
        return next(new UnauthorizedError(`Cookies object ${options.requestProperty} was not found. Check your configuration.`))
      }
      const permissions = user[options.permissionsProperty]
      if (!permissions) {
        return next(new UnauthorizedError(`Could not find ${options.permissionsProperty} in ${options.requestProperty}. Bad configuration?`))
      }
      if (!Array.isArray(permissions)) {
        return next(new UnauthorizedError('Permissions should be an Array. Bad format?'))
      }
      const sufficient = sufficientCheck(requiredPermissions, permissions)
      return next(!sufficient ? new PermissionError('insufficient permissions') : null)
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
