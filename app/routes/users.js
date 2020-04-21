const express = require('express')
const router = express.Router()
const userService = require('../services/userService')
const User = require('../models/User')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    res.json(await User.query())
  } catch (err) {
    next(err)
  }
})

router.post('/verify', async (req, res, next) => {
  console.log('in verify route')
  try {
    if (req.body.id_token) {
      const user = await userService.ensureUser(req.body.id_token)
      res.json(user)
    } else {
      throw new Error('id_token not found in cookies')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await User.query().findById(req.params.id).withGraphFetched('[places, activities, scopes]'))
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
