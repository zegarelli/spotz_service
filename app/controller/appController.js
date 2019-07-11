'use strict';

var Comment = require('../model/appModel.js');

exports.list_all_comments = function(req, res) {
  Comment.getAllComments(function(err, comment) {

    console.log('controller')
    if (err)
      res.send(err);
      console.log('res', comment);
    res.send(comment);
  });
};



exports.create_a_comment = function(req, res) {
  var new_comment = new Comment(req.body);

  //handles null error 
   if(!new_comment.comment || !new_comment.status){

            res.status(400).send({ error:true, message: 'No comment provided' });

        }
else{
  
  Comment.createComment(new_comment, function(err, comment) {
    
    if (err)
      res.send(err);
    res.json(comment);
  });
}
};


exports.read_a_comment = function(req, res) {
  Comment.getCommentById(req.params.commentId, function(err, comment) {
    if (err)
      res.send(err);
    res.json(comment);
  });
};


exports.update_a_comment = function(req, res) {
  Comment.updateById(req.params.commentId, new Comment(req.body), function(err, comment) {
    if (err)
      res.send(err);
    res.json(comment);
  });
};


exports.delete_a_comment = function(req, res) {


  Comment.remove(req.params.commentId, function(err, comment) {
    if (err)
      res.send(err);
    res.json({ message: 'Comment successfully deleted' });
  });
};