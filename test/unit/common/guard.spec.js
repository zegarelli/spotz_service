/* global describe, it, beforeEach, expect */
const guard = require('../../../app/common/guard')
const { stubRes } = require('../../support/testUtil')
const { UnauthorizedError, PermissionError } = require('../../../app/common/errors')

describe('guard', function () {
  let req, res
  beforeEach(function () {
    req = {
      method: 'POST',
      url: '/'
    }
    res = stubRes()
  })
  describe('middle checks', function () {
    it('does not allow an undefined user setting', function () {
      guard.options({ requestProperty: undefined })
      return guard.checkAll(['ping'])(req, res, function (err) {
        expect(err).instanceOf(UnauthorizedError)
        expect(err.message).match(/requestProperty/)
      })
    })
    it('requires user object', function () {
      guard.options({
        requestProperty: 'user',
        permissionsProperty: 'scopes'
      })
      return guard.checkAll(['ping'])(req, res, function (err) {
        expect(err).instanceOf(UnauthorizedError)
        expect(err.message).match(/not found/)
      })
    })
    it('requires correct user object', function () {
      guard.options({
        requestProperty: 'identity',
        permissionsProperty: 'bar'
      })
      req.user = { scopes: ['foobar'] }
      return guard.checkAll('ping')(req, res, function (err) {
        expect(err).instanceOf(UnauthorizedError)
        expect(err.message).match(/not found/)
      })
    })
    it('requires correct permissions object', function () {
      guard.options({
        requestProperty: 'user',
        permissionsProperty: 'scopes'
      })
      req.user = { permissions: ['foobar'] }
      return guard.checkAll(['ping'])(req, res, function (err) {
        expect(err).instanceOf(UnauthorizedError)
        expect(err.message).match(/not find scopes/)
      })
    })
    it('requires permissions to be an array', function () {
      req.user = { scopes: 'foobar' }
      return guard.checkAll(['ping'])(req, res, function (err) {
        expect(err).instanceOf(UnauthorizedError)
        expect(err.message).match(/should be an Array/)
      })
    })
  })
  describe('check all', function () {
    it('fails if not all are met', function () {
      req.user = {
        scopes: ['foo', 'bar']
      }
      return guard.checkAll(['foo', 'ping'])(req, res, function (err) {
        expect(err).instanceOf(PermissionError)
      })
    })
    it('passes if all are met', function () {
      req.user = {
        scopes: ['foo', 'bar']
      }
      guard.checkAll(['foo', 'bar'])(req, res, function (err) {
        expect(err).to.be.null()
      })
    })
    it('passes when SECURITY_OFF is set', function () {
      guard.options({ securityOff: true })
      delete req.user
      guard.checkAll(['foo', 'bar'])(req, res, function (err) {
        expect(err).to.be.null()
      })
    })
  })
  describe('check any', function () {
    it('fails if none are met', function () {
      guard.options({ securityOff: null })
      req.user = {
        scopes: ['foo', 'bar']
      }
      return guard.checkAny(['ping', 'pong'])(req, res, function (err) {
        expect(err).instanceOf(PermissionError)
      })
    })
    it('passes if any are met', function () {
      req.user = {
        scopes: ['foo', 'bar']
      }
      guard.checkAny(['foo', 'ping'])(req, res, function (err) {
        expect(err).to.be.null()
      })
    })
    it('accepts a string', function () {
      req.user = {
        scopes: ['foo', 'bar']
      }
      guard.checkAny('foo')(req, res, function (err) {
        expect(err).to.be.null()
      })
    })
    it('passes when SECURITY_OFF is set', function () {
      const newGuard = require('../../../app/common/guard')
      newGuard.options({ securityOff: true })
      delete req.user
      guard.checkAny(['foo', 'bar'])(req, res, function (err) {
        expect(err).to.be.null()
      })
    })
  })
  describe('configuration', function () {
    beforeEach(function () {
      delete require.cache[require.resolve('../../../app/common/guard')]
    })
    it('defaults to security on', function () {
      const newGuard = require('../../../app/common/guard')
      expect(newGuard.options().securityOff).to.not.eql(true)
    })
    it('turns security off with appropriate env vars', function () {
      process.env.SECURITY_OFF = 'true'
      process.env.NODE_ENV = 'development'
      const guardSecurityOff = require('../../../app/common/guard')
      expect(guardSecurityOff.options().securityOff).to.eql(true)
    })
    it('turns security off with appropriate env vars 2', function () {
      process.env.SECURITY_OFF = 'true'
      process.env.NODE_ENV = 'test'
      const guardSecurityOff = require('../../../app/common/guard')
      expect(guardSecurityOff.options().securityOff).to.eql(true)
    })
    it('leaves security on without exact env vars', function () {
      process.env.SECURITY_OFF = '1'
      process.env.NODE_ENV = 'test'
      const guardSecurityOn = require('../../../app/common/guard')
      expect(guardSecurityOn.options().securityOff).to.not.eql(true)
    })
    it('leaves security on without exact env vars', function () {
      process.env.SECURITY_OFF = 'true'
      process.env.NODE_ENV = 'production'
      const guardSecurityOn = require('../../../app/common/guard')
      expect(guardSecurityOn.options().securityOff).to.not.eql(true)
    })
  })
})
