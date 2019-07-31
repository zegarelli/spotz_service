const express = require('express')
const router = express.Router()

const User = require('../models/User')

/* GET users listing. */
router.get('/', async (req, res) => {
  let query = await User.query()
  let users = req.query.user
  users = { users }
  console.log(users)
  query = query.where(users)
  res.json(query)
})

router.get('/:id', async (req, res) => {
  // gets one idea, found by id.
  // Also fetches the related comments using the .eager method
  const user = await User.query().findById(req.params.id)
  res.json(user)
})

router.get('/:id/places', async (req, res) => {
  // gets one idea, found by id.
  // Also fetches the related comments using the .eager method
  const user = await User.query().findById(req.params.id).eager('places')
  res.json(user)
})

router.get('/:id/activities', async (req, res) => {
  // gets one idea, found by id.
  // Also fetches the related comments using the .eager method
  const user = await User.query().findById(req.params.id).eager('activities')
  res.json(user)
})

router.post('/', async (req, res) => {
  // creates a new idea from the request body
  // only allows the idea and creator fields for safety
  const newUser = req.body

  const user = await User.query()
    .allowInsert('[idea, creator]')
    .insert(newUser)

  res.send(user)
})

router.delete('/:id', async (req, res) => {
  // deletes an idea
  await User.query().deleteById(req.params.id)

  res.redirect('/ideas')
})

module.exports = router
