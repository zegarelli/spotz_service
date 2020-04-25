/* global describe, it, beforeEach, expect */
const jwt = require('jsonwebtoken')
const { TokenError } = require('../../../app/common/errors')
const token = require('../../../app/common/token')

require('../../support/node')

describe('token', function () {
  describe('decode', function () {
    beforeEach(function () {
      this.sinon.stub(jwt, 'verify').resolves('decodedToken')
    })
    it('decodes the token', async function () {
      const results = await token.decode('abcde')
      expect(results).to.equal('decodedToken')
    })
    it('throws token error when token can\'t be decoded', async function () {
      jwt.verify.throws('some error')
      try {
        await token.decode('abcde')
      } catch (err) {
        expect(err).instanceOf(TokenError)
        expect(err.message).to.equal('Unable to decode token')
      }
    })
  })
})
