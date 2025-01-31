const express = require('express')
const router = express.Router()
const guard = require('../common/guard')
const placeService = require('../services/placeService')

router.get('/', async (req, res, next) => {
  const name = req.query.name || null
  const creator = req.query.creator || null
  try {
    const places = await placeService.search(name, creator)
    res.json(places)
  } catch (err) {
    next(err)
  }
})

router.post('/', guard.checkAny(['objects:create']), async (req, res, next) => {
  try {
    const result = await placeService.create(req.body, req.user.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', guard.checkAny(['objects:edit']), async (req, res, next) => {
  try {
    const result = await placeService.update(req.params.id, req.body, req.user.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await placeService.getById(req.params.id))
  } catch (err) {
    next(err)
  }
})

module.exports = router
