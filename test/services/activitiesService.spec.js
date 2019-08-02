/* global before, describe, it, expect */

const { get, search } = require('../../services/activitiesService')

describe('get', () => {
  it('is a function', () => {
    const result = typeof get
    expect(result).toEqual('function')
  })
})

describe('search', () => {
  it('is a function', () => {
    const result = typeof search
    expect(result).toEqual('function')
  })
})