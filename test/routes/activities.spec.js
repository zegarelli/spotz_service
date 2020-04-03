const activities = require('../../routes/activities')

describe('get', () => {
  it('is a function', () => {
    const expected = 'function'

    const result = typeof activities
    expect(result).toEqual(expected)
  })
})