const jwt = require('jsonwebtoken')
const { jwk } = require('../common/config')
const jwkToPem = require('jwk-to-pem')

async function decode (token) {
  const pem = jwkToPem(jwk)
  try {
    const decodedToken = await jwt.verify(token, pem, { algorithms: ['RS256'] })
    return decodedToken
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  decode
}
