const express = require('express')
const router = express.Router()
const guard = require('../common/guard')
const scopeService = require('../services/scopeService')

router.get('/', async (req, res, next) => {
  try {
    const places = await scopeService.get()
    res.json(places)
  } catch (err) {
    next(err)
  }
})

router.post('/', guard.checkAny(['admin:manage']), async (req, res, next) => {
  try {
    const result = await scopeService.create(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', guard.checkAny(['admin:manage']), async (req, res, next) => {
  try {
    const result = await scopeService.update(req.params.id, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await scopeService.getById(req.params.id))
  } catch (err) {
    next(err)
  }
})

module.exports = router
