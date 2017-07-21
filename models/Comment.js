//require Mongoose
var mongoose = require("mongoose");

//create schema class
var Schema = mongoose.Schema;

//create comment schema
var CommentSchema = new Schema({
    //author of the comment
    author: {
        type: String,
        trim: true,
        required: true,
        max: 100
    },
    content: {
        type: String,
        required: true
    },
    userCreated: {
        type: Date,
        default: Date.now
    }
});

//create Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

//export the model
module.exports = Comment;