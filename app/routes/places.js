const express = require('express')
const router = express.Router()

const Place = require('../models/Place')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    res.json(await Place.query())
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await Place.query().findById(req.params.id))
  } catch (err) {
    next(err)
  }
})

module.exports = router
