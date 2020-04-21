const jwt = require('jsonwebtoken')
const { jwk } = require('../common/config')
const jwkToPem = require('jwk-to-pem')

const { TokenError } = require('../common/errors')

async function decode (token) {
  const pem = jwkToPem(jwk)
  try {
    const decodedToken = await jwt.verify(token, pem, { algorithms: ['RS256'] })
    return decodedToken
  } catch (err) {
    throw new TokenError('Unable to decode token', err)
  }
}

module.exports = {
  decode
}
