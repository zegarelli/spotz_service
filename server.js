const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

// var connection = require('./app/model/db'); //importing connection

app.listen(port)

console.log('API server started on: ' + port)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var routes = require('./app/routes/appRoutes') // importing route
routes(app) // register the route
