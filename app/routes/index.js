const router = require('express').Router()

router.use('/users', require('./users'))
router.use('/places', require('./places'))
router.use('/activities', require('./activities'))
router.use('/comments', require('./comments'))
router.use('/scopes', require('./scopes'))

module.exports = router
