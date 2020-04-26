const User = require('../models/User')
const token = require('../common/token')

const uuid = require('uuid')

async function createUser (email, username, verified) {
  const user = User.query().insert({
    id: uuid.v4(),
    email,
    username,
    verified: verified === true ? verified : false
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
  const tokenData = await token.decode(idToken)
  const email = tokenData.email
  const users = await User.query().where({ email })

  if (users.length === 1) {
    return users[0]
  } else if (users.length === 0) {
    const { 'cognito:username': username, email_verified: verified } = tokenData
    if (username && email) {
      const user = await createUser(email, username, verified)
      return user
    } else {
      throw new Error(`username or email not found in tokenData: ${JSON.stringify(tokenData, null, 2)}`)
    }
  } else {
    throw new Error(`multiple Users with the same email: ${email} found`)
  }
}

module.exports = {
  createUser,
  getUserScopes,
  ensureUser
}
