/* global before, describe, it, expect */

const dbConfig = require('../../knexfile')
const knex = require('knex')(dbConfig)
const { get, search } = require('../../services/activitiesService')

describe('get', () => {
  it('is a function', () => {
    const expected = 'function'
    
    const result = typeof get
    expect(result).toEqual(expected)
  })
})

describe('search', () => {
  it('is a function', () => {
    const expected = 'function'

    const result = typeof search
    expect(result).toEqual(expected)
  })

  it('returns an array', async () => {
    const expected = 0

    const result = await search({})
    expect(result.length).toBeGreaterThan(expected)
  })
})