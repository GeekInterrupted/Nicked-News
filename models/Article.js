//require Mongoose
var mongoose = require("mongoose");

//create a schema class
var Schema = mongoose.Schema;

//create article schema
var ArticleSchema = new Schema({
    //title is a required string
    title: {
        type: String,
        required: true
    },
    //link is a required string
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    //saves one comment's ObjectId, ref refers to the Comment model
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

//creates Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

//export the model
module.exports = Article;