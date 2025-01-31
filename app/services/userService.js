const User = require('../models/User')
const UserScope = require('../models/UserScope')
const token = require('../common/token')
const scopeService = require('./scopeService')

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

async function getUsers () {
  const users = await User.query().withGraphFetched('[scopes]')
  return users
}

async function getUserIdAndScopes (email) {
  const users = await User.query()
    .withGraphFetched('[scopes]')
    .where({ email })
  if (users.length > 1) {
    throw new Error(`Multiple Users with the same email: ${email} found`)
  } else if (users.length === 0) {
    throw new Error(`No user with email: ${email} found`)
  }
  const scopes = users[0].scopes.map(scope => scope.name)
  return { id: users[0].id, scopes }
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

      // I don't really see a reason to await this
      await giveBaseScopes(user.id)

      return user
    } else {
      throw new Error(`username or email not found in tokenData: ${JSON.stringify(tokenData, null, 2)}`)
    }
  } else {
    throw new Error(`multiple Users with the same email: ${email} found`)
  }
}

async function giveBaseScopes (userId) {
  const scopes = await scopeService.getBaseScopes()
  let errors = ''
  for (const scope of scopes) {
    try {
      await UserScope.query().insert({
        id: uuid.v4(),
        user_id: userId,
        scope_id: scope.id
      })
    } catch (err) {
      errors += `Error creating baseScope: ${scope.id} for user: ${userId}\n`
    }
  }
  if (errors) {
    throw new Error(errors)
  }
}

async function addScope (id, data) {
  if (!data.scopeId) {
    throw new Error('No scopeId included in body')
  }
  const result = UserScope.query().insert({
    id: uuid.v4(),
    user_id: id,
    scope_id: data.scopeId
  })
  return result
}

async function removeScope (id, data) {
  if (!data.scopeId) {
    throw new Error('No scopeId included in body')
  }
  const result = UserScope.query().where({
    user_id: id,
    scope_id: data.scopeId
  }).delete()
  return result
}

module.exports = {
  createUser,
  getUsers,
  getUserIdAndScopes,
  ensureUser,
  giveBaseScopes,
  addScope,
  removeScope
}
