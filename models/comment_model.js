const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    userId : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
    },
    userImage : {
        type : String,
    },
    posterId : {
        type : String,
        required : true,
    },
    date : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;