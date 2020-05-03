/* global describe, it, beforeEach, expect */
const buildTree = require('../../../app/common/commentTree')

require('../../support/node')

describe('commentTree', function () {
  let raw, expected
  beforeEach(function () {
    raw = [
      {
        id: 1,
        parentComment: false
      },
      {
        id: 2,
        parentComment: 1
      },
      {
        id: 3,
        parentComment: false
      },
      {
        id: 4,
        parentComment: 2
      }
    ]

    expected = [
      {
        id: 1,
        parentComment: false,
        children: [
          {
            id: 2,
            parentComment: 1,
            children: [
              {
                id: 4,
                parentComment: 2,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 3,
        parentComment: false,
        children: []
      }
    ]
  })
  it('builds a tree', function () {
    const result = buildTree(raw)
    expect(result).to.deep.equal(expected)
  })
})
