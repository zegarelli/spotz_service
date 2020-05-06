const siteConfig = {
  jsMain: 'http://spotzreact.s3-website.us-east-2.amazonaws.com/',
  title: 'Spotz'
}

const allowedOrigins = [
  'http://localhost:9000',
  'http://localhost:3000',
  'http://spotz.world'
]

const jwk = {
  alg: 'RS256',
  e: 'AQAB',
  kid: process.env.AUTH_KID || '',
  kty: 'RSA',
  n: process.env.AUTH_N || '',
  use: 'sig'
}

module.exports = {
  siteConfig,
  allowedOrigins,
  jwk
}
