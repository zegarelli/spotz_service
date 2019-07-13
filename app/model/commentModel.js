'user strict';
var client = require('./heroku_db')

//Comment object constructor
var Comment = function(comment){
    this.comment = comment.comment;
    this.status = comment.status;
    this.created_at = new Date();
};
Comment.createComment = function createComment(newComment, result) {    
    const text = 'INSERT INTO comments(comment, status, created_at) VALUES($1, $2, $3) RETURNING *'
    var values = [newComment['comment'], newComment['status'], newComment['created_at']]
    console.log(values);
    client.query(text, values, function (err, res) {
                
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    console.log(res.rows[0]);
                    console.log('create result', typeof result)
                    result(null, res.rows[0].id);
                }
            });           
};
Comment.getCommentById = function createComment(commentId, result) {
    const text = "Select comment from comments where id = $1"    
    var values = [commentId]
    client.query(text, values, function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res); //This is fine
              
                }
            });   
};
Comment.getAllComments = function getAllComment(result) {
        client.query("Select * from comments", function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                  console.log('comments : ', res);  

                 result(null, res);
                }
            });   
};
Comment.updateById = function(id, comment, result){
  client.query("UPDATE comments SET comment = $1 WHERE id = $2", [comment.comment, id], function (err, res) {
          if(err) {
              console.log("error: ", err);
                result(null, err);
             }
           else{   
             result(null, res); //This is fine
                }
            }); 
};
Comment.remove = function(id, result){
    const text = "DELETE FROM comments WHERE id = $1"
    client.query(text, [id], function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
               
                 result(null, res);
                }
            }); 
};

module.exports = Comment;