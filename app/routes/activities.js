const express = require('express')
const router = express.Router()
const guard = require('../common/guard')
const activityService = require('../services/activityService')

/* GET activities listing. */
router.get('/', guard.checkAny(['admin:manage']), async (req, res, next) => {
  const name = req.query.name || null
  const creator = req.query.creator || null
  const place = req.query.place || null

  try {
    const activities = await activityService.search(name, creator, place)
    res.json(activities)
  } catch (err) {
    err.metaData = {
      ...err.metaData,
      query: req.query
    }
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const result = await activityService.create(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const result = await activityService.update(req.params.id, req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await activityService.getById(req.params.id))
  } catch (err) {
    next(err)
  }
})

module.exports = router
