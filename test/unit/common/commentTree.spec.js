/* global describe, it, beforeEach, expect */
const buildTree = require('../../../app/common/commentTree')

require('../../support/node')

describe('commentTree', function () {
  let raw, expected
  beforeEach(function () {
    raw = [
      {
        id: 1,
        parent_id: false
      },
      {
        id: 2,
        parent_id: 1
      },
      {
        id: 3,
        parent_id: false
      },
      {
        id: 4,
        parent_id: 2
      }
    ]

    expected = [
      {
        id: 1,
        parent_id: false,
        children: [
          {
            id: 2,
            parent_id: 1,
            children: [
              {
                id: 4,
                parent_id: 2,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 3,
        parent_id: false,
        children: []
      }
    ]
  })
  it('builds a tree', function () {
    const result = buildTree(raw)
    expect(result).to.deep.equal(expected)
  })
})
