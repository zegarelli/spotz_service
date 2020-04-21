const allowedOrigins = [
  'http://localhost:3000',
  'http://spotz.world'
]

const jwk = {
  alg: 'RS256',
  e: 'AQAB',
  kid: process.env.AUTH_KID,
  kty: 'RSA',
  n: process.env.AUTH_N,
  use: 'sig'
}

module.exports = {
  allowedOrigins,
  jwk
}
