const siteConfig = {
  jsMain: 'http://spotzreact.s3-website.us-east-2.amazonaws.com/static/js/main.d85c877f.chunk.js',
  jsMain2: 'http://spotzreact.s3-website.us-east-2.amazonaws.com/static/js/2.b34bd16c.chunk.js',
  jsMain3: 'http://spotzreact.s3-website.us-east-2.amazonaws.com/static/js/runtime-main.35eb2b37.js',
  styleSheet: '//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css',
  title: 'Spotz2'
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
