const express = require('express')
const router = express.Router()
const guard = require('../common/guard')
const commentService = require('../services/commentService')

router.get('/', async (req, res, next) => {
  const objectId = req.query.objectId || null
  try {
    const places = await commentService.get(objectId)
    res.json(places)
  } catch (err) {
    next(err)
  }
})

router.post('/', guard.checkAny(['admin:manage']), async (req, res, next) => {
  try {
    const result = await commentService.create(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', guard.checkAny(['admin:manage']), async (req, res, next) => {
  try {
    const result = await commentService.update(req.params.id, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', guard.checkAny(['admin:manage']), async (req, res, next) => {
  try {
    const result = await commentService.delete(req.params.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
