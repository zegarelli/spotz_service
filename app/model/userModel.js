'user strict';
const jwt = require('jsonwebtoken');
var verifyUser = require('../middleware/verifyUser')
var client = require('./heroku_db')

var User = function(user){
    this.username = user.username;
    this.hash = user.hash;
    this.email = user.email;
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

User.register = function register(user_info, result) {
  const text = 'INSERT INTO accounts(username, password, email, created_on, last_login) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING user_id'
  var values = [user_info.username, user_info.hash, user_info.email]
  client.query(text, values, function (err, res) {
              
              if(err) {
                  console.log("error: ", err);
                  result(err, null);
              }else{
                  console.log('User:', res.rows[0].user_id, 'created.');
                  result(null, res.rows[0].user_id);
              }
          });
        };           

module.exports = User;