'use strict'

const jwt = require('jsonwebtoken')

var Comment = require('../model/commentModel')

exports.list_all_comments = function (req, res) {
  Comment.getAllComments(function (err, comment) {
    if (err) { res.send(err) }
    console.log('res', comment)
    res.send(comment)
  })
}

exports.create_a_comment = function (req, res) {
  var newComment = new Comment(req.body)

  // handles null error
  if (!newComment.comment || !newComment.status) {
    res.status(400).send({ error: true, message: 'No comment provided' })
  } else {
    Comment.createComment(newComment, function (err, commentId) {
      if (err) { res.send(err) }
      res.json(commentId)
    })
  }
}

exports.read_a_comment = function (req, res) {
  Comment.getCommentById(req.params.commentId, function (err, comment) {
    if (err) { res.send(err) }
    res.json(comment)
  })
}

exports.update_a_comment = function (req, res) {
  Comment.updateById(req.params.commentId, new Comment(req.body), function (err, comment) {
    if (err) { res.send(err) }
    res.json(comment)
  })
}

exports.delete_a_comment = function (req, res) {
  jwt.verify(req.token, process.env.SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403)
      res.send(err)
    } else {
      Comment.remove(req.params.commentId, function (err, comment) {
        if (err) {
          res.sendStatus(403)
          res.send(err)
        } else {
          res.json({ message: 'Comment successfully deleted' })
        }
      })
    }
  })
}
