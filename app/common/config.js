const siteConfig = {
  jsMain: `https://spotzstatic.s3.us-east-2.amazonaws.com/builds/${process.env.SPOTZ_VERSION}/main-chunk.js`,
  jsMain2: `https://spotzstatic.s3.us-east-2.amazonaws.com/builds/${process.env.SPOTZ_VERSION}/build-chunk.js`,
  jsMain3: `https://spotzstatic.s3.us-east-2.amazonaws.com/builds/${process.env.SPOTZ_VERSION}/runtime-main.js`,
  styleSheet: '//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css',
  title: 'Spotz'
}

const allowedOrigins = [
  'http://localhost:9000',
  'http://localhost:3000',
  'https://spotz.world'
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
