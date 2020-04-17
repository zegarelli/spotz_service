const User = require('../models/User')

// async function createUser () {

// }

async function getUserScopes (email) {
  try {
    const users = await User.query()
      .withGraphFetched('[scopes]')
      .where({ email })
    if (users.length > 1) {
      throw new Error(`Multiple Users with the same email: ${email} found`)
    }
    const scopes = users[0].scopes.map(scope => scope.name)
    return scopes
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getUserScopes
}
