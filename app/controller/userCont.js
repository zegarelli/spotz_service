'use strict';

var User = require('../model/userModel');

exports.login = function(req, res) {
  var user_info = new User(req.body);

  User.login(user_info, function(err, user_token) {

    if(err) {
      res.send(err);
    }else{
      console.log(user_info.username, ' logged in.');
      res.json(user_token);
    }
  });
};

exports.register = function(req, res) {
  var user_info = new User(req.body);

  User.register(user_info, function(err, user_id) {

    if(err) {
      res.send(err);
    }else{
      user_token = user_info.login(user_info, user_token) {

        if(err) {
          res.send(err);
        }else{
          console.log(user_info.username, ' logged in.');
          res.json(user_token);
        }
      }
    }
  });
};