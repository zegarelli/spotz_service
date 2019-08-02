const express = require('express')
const router = express.Router()

/*
Test end-point for our react demo
*/
router.get('/', function(req, res, next) {
    res.send('API is working properly');
});

module.exports = router