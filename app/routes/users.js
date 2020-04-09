const express = require('express')
const router = express.Router()

const User = require('../models/User')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    res.json(await User.query())
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await User.query().findById(req.params.id).withGraphFetched('[places, activities]'))
  } catch (err) {
    next(err)
  }
})

router.get('/:id/places', async (req, res, next) => {
  try {
    res.json(await User.query().findById(req.params.id).withGraphFetched('places'))
  } catch (err) {
    next(err)
  }
})

router.get('/:id/activities', async (req, res, next) => {
  try {
    res.json(await User.query().findById(req.params.id).withGraphFetched('activities'))
  } catch (err) {
    next(err)
  }
})

module.exports = router
