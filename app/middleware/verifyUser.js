'user strict';
var client = require('../model/heroku_db')
const bcrypt = require('bcrypt');

module.exports = function verifyUser(user, result){

    const text = 'SELECT * from accounts WHERE username = $1'
    var values = [user.username]
    client.query(text, values, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }else if (res.rows[0] != undefined){
            bcrypt.compare(user.password, res.rows[0].hash, function(err, verified) {
                if (verified == true){
                    result(null, res.rows[0].user_id);
                    user.password = null; //Clear string pass
                }else{
                    result('Password not correct.', null);
                }
            });
        } else {
            result('User not found with username: ' + user.username, null);
        }
    });           

};