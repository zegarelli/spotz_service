'use strict';
module.exports = function(app) {
  var comments = require('../controller/appController.js');
  // Enable this for dev
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type"); 
    res.header("Access-Control-Allow-Methods", "DELETE");
    next();
  });


  // comment Routes
  app.route('/comments')
    .get(comments.list_all_comments)
    .post(comments.create_a_comment);
   
   app.route('/comments/:commentId')
    .get(comments.read_a_comment)
    .put(comments.update_a_comment)
    .delete(comments.delete_a_comment);
    };