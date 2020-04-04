const express = require('express')
const router = express.Router()

const Place = require('../models/Place')

/* GET users listing. */
router.get('/', async (req, res) => {
  const places = await Place.query()
  res.json(places)
})

router.get('/:id', async (req, res) => {
  // gets one idea, found by id.
  // Also fetches the related comments using the .eager method
  const place = await Place.query().findById(req.params.id)
  res.json(place)
})

module.exports = router
