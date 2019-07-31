const express = require('express')
const router = express.Router()

const Activity = require('../models/Activity')
const activityService = require('../services/activitiesService')

/* GET activities listing. */
router.get('/', async (req, res) => {
  const name = req.query.name || null
  const creator = req.query.creator || null
  const place = req.query.place || null

  try {
    const results = await activityService.search({ name, creator, place })
    res.json(results)
  } catch (err) {
    err.httpMeta = {
      query: { status, after, before },
      operation: 'getBatches',
      description: 'failed to search batches'
    }
    next(err)
  }
})

router.get('/:id', async (req, res) => {
  const activities = await Activity.query().findById(req.params.id)
  res.json(activities)
})

router.get('/:id/users', async (req, res) => {
  const activities = await Activity.query().findById(req.params.id).eager('users')
  res.json(activities)
})


module.exports = router
