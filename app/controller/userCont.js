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
      if(err.detail.startsWith("Key (username)=")){  // Username already exists
        res.send('Username already exists, please pick another')
      }else if (err.detail.startsWith("Key (email)=")){
        res.send('An account with that email already exists')
        //Maybe redirect to forgot password portal? 
      }else{
        res.send(err); //Something else happened, send them full err
      }
    }else{
      User.login(user_info, function(err, user_token) {

        if(err) {
          res.send(err);
        }else{
          console.log(user_info.username, ' logged in.');        
          res.json(user_token);
        }
      });
    }
  });
};