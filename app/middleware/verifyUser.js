'user strict';
var client = require('../model/heroku_db')

module.exports = function verifyUser(user, result){

    const text = 'SELECT * from accounts WHERE username = $1'
    var values = [user.username]
    client.query(text, values, function (err, res) {
                
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }else{
            if(user.hash === res.rows[0].password){
                console.log('verify result', typeof result)
                console.log('User: ', user.username, 'has logged in!')
                result(null, 1);  // ERROR: Result is not a function
            }
        }
    });           

};