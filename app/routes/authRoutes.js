var express = require('express')
var isAuth = require('../middleware/authMiddleware')
var authRouter = express.Router()
var comments = require('../controller/commentController')

// These routs shall require Auth
authRouter.use(isAuth)

authRouter.delete('/comments/:commentId', comments.delete_a_comment) // Requires isAuth to next()

module.exports = authRouter
