function sayHello (name) {
  console.log('Hello ' + name) // Globa: Access from anywhere
}

sayHello("Hello, Jackson. \n Welcome to Node.js. Remember, if you're going to work hard, work for youself.")

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

app.listen(port)

console.log('API server started on: ' + port)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var routes = require('./routes/appRoutes') // importing route
routes(app) // register the route
