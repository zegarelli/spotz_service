'use strict';

var User = require('../model/userModel');

exports.login = function(req, res) {
  var user_info = new User(req.body);

  User.login(user_info, function(err, user_token) {

    if (err)
      res.send(err);
      console.log('res', user_info);
    res.json(user_token);
  });
};