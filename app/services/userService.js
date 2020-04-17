const User = require('../models/User')

// async function createUser () {

// }

async function getUserScopes (email) {
  try {
    const scopes = await User.query().select('id').where({ email })
    return scopes
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getUserScopes
}
