'use strict';
module.exports = function(app) {
  var comments = require('../controller/commentController');
  var user = require('../controller/userCont');
  var auth = require('./authRoutes')

  // Enable this for dev
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type"); 
    res.header("Access-Control-Allow-Methods", "DELETE");
    next();
  });


  // Main app router

  // User routes
  app.route('/login')
    .post(user.login);

  app.route('/register')
    .post(user.register)

  // comment Routes
  app.route('/comments')
    .get(comments.list_all_comments)
    .post(comments.create_a_comment);
   
  app.route('/comments/:commentId')
  .get(comments.read_a_comment)
  .put(comments.update_a_comment)

  app.use('/auth', auth)

};