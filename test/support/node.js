/* global beforeEach, afterEach */
if (process.env.NODE_ENV !== 'test') throw new Error('Tests should be run in NODE_ENV=test')

const sinon = require('sinon')
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const chaiHttp = require('chai-http')
const chaiAsPromised = require('chai-as-promised')

chai.use(dirtyChai)
chai.use(chaiAsPromised)
chai.use(chaiHttp)
chai.use(require('sinon-chai'))

global.expect = chai.expect
global.chaiAsPromised = chaiAsPromised
global.expect = chai.expect
global.AssertionError = chai.AssertionError
global.Assertion = chai.Assertion
global.assert = chai.assert

beforeEach(function () {
  this.sinon = sinon.createSandbox().usingPromise(require('bluebird'))
})
afterEach(function () {
  if (this.sinon && this.sinon.restore) this.sinon.restore()
})

module.exports = {}
