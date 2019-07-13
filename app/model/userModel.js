'user strict';
const jwt = require('jsonwebtoken');
var verifyUser = require('../middleware/verifyUser')

var User = function(user){
    this.username = user.username;
    this.hash = user.hash;
    this.token_payload = {
      username: user.username
    }
}

User.login = function login(user_info, res) { 
  verifyUser(user_info, function(err, result) {
    if(result === 1) {
      jwt.sign(user_info.token_payload, process.env.SECRET, {expiresIn:  '24h'}, function(err, token) {
        if(err) {
          console.log("error: ", err);
        }
        else{
          res(token, null);
        }
      })
    } else {
      console.log('Error verifying user: ', err)
      res(null, "User not found, redirecting..")
      //Redirct method
    }

  })
}

module.exports = User;