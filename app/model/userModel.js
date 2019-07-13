'user strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var verifyUser = require('../middleware/verifyUser')
var client = require('./heroku_db')

var User = function(user){
    this.username = user.username;
    this.password = user.password;
    this.hash = bcrypt.hash(user.password, 10) //Hash promise - requires .then when needed
    this.email = user.email;
    this.token_payload = {
      username: user.username
    }
}

User.login = function login(user_info, res) { 
  verifyUser(user_info, function(ver_err, result) {
    if(result === 1) {
      jwt.sign(user_info.token_payload, process.env.SECRET, {expiresIn:  '24h'}, function(err, token) {
        if(err) {
          console.log("error: ", err);
          res(err, null);
        }
        else{
          res(null, {'bearer': token});
        }
      })
    } else {
      console.log('Error verifying user: ', ver_err)
      res('Error verifying user: ' + ver_err, null)
      //Redirct method
    }

  })
}

User.register = function register(user_info, result) {
  const text = 'INSERT INTO accounts(username, hash, email, created_on, last_login) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING user_id'
  user_info.hash.then(function(hash){
    var values = [user_info.username, hash, user_info.email]
    client.query(text, values, function (err, res) {
                
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }else{
                    console.log('User:', res.rows[0].user_id, 'created.');
                    result(null, res.rows[0].user_id);
                }
            });
          });           
  };

module.exports = User;