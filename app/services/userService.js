const User = require('../models/User')
const { decode } = require('../common/token')

const uuid = require('uuid')

async function createUser (email, username, verified) {
  const user = User.query().insert({
    id: uuid.v4(),
    email,
    username,
    verified
  }).returning('*')
  return user
}

async function getUserScopes (email) {
  const users = await User.query()
    .withGraphFetched('[scopes]')
    .where({ email })
  if (users.length > 1) {
    throw new Error(`Multiple Users with the same email: ${email} found`)
  }
  const scopes = users[0].scopes.map(scope => scope.name)
  return scopes
}

async function ensureUser (idToken) {
  const tokenData = await decode(idToken)
  const email = tokenData.email
  const users = await User.query().where({ email })

  if (users.length === 1) {
    return users[0]
  } else if (users.length === 0) {
    const { 'cognito:username': username, email_verified: verified } = tokenData
    if (username && email) {
      const user = await createUser(email, username, verified)
      return user
    }
  } else {
    throw new Error(`Multiple Users with the same email: ${email} found`)
  }
}

module.exports = {
  getUserScopes,
  ensureUser
}
