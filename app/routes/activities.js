const express = require('express')
const router = express.Router()

const Activity = require('../models/Activity')
const activityService = require('../services/activityService')

/* GET activities listing. */
router.get('/', async (req, res, next) => {
  const name = req.query.name || null
  const creator = req.query.creator || null
  const place = req.query.place || null

  try {
    const results = await activityService.search(name, creator, place)
    res.json(results)
  } catch (err) {
    err.metaData = {
      ...err.metaData,
      query: req.query
    }
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await Activity.query().findById(req.params.id))
  } catch (err) {
    next(err)
  }
})

module.exports = router
