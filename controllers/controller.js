//dependencies
var express = require("express");
var router = express.Router();
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");


var app = express();

//import models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");


// Index Page Render (first visit to the site)
router.get("/", function (req, res){
  // Scrape data
  res.redirect("/scraped");
});


//route to scraped data
router.get("/scraped", function(req, res) {
    //request for the news 
    request("https://news.js.org/", function(error, response, html) {
        //load html body from request into cheerio
        var $ = cheerio.load(html);

        //find all h3 items with the "Item-headline" class
        $("h2.post-title").each(function(i, element) {
            //save a empty result object
            var result = {};

            result.title = $(this).text();
            result.link = $(this).children("a").attr("href");

            //use Article model to create a new entry
            var entry = new Article(result);

            //save entry to db
            entry.save(function(err, doc) {
                //log errors
                if (err) {
                    console.log(err);
                }
                //saved with no errors - log the doc
                else {
                    console.log(doc);
                }
            });
        });
            res.redirect("/articles");
    });
    // Tell the browser that we finished scraping the text

});

//render the articles
router.get("/articles", function(req, res) {
    //mongo db results are displayed and sorted
    Article.find().sort({ _id: -1 })
        //populate all of the comments associated with the articles
        .populate("comments")
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                var hbsObject = { articles: doc, comments: doc }
                res.render('index', hbsObject);
                // res.json(hbsObject)
            }
        });
});

router.post("/add/comment/:id", function(req, res) {
    var articleId = req.params.id;
    var commentAuthor = req.body.name;
    var commentContent = req.body.comment;

    //this variable will hold the key value pairs from the comment model
    var result = {
        author: commentAuthor,
        content: commentContent
    };
    //create comment entry from the comment model
    var entry = new Comment(result);
    //save the entry in the db
    entry.save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            Article.findOneAndUpdate({ "_id": articleId }, {
                    $push: {
                        "comments": doc._id
                    }
                }, { "new": true })
                .exec(function(error, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.sendStatus(200);
                    }
                });
        }
    });
});

//delete comment
router.post("/remove/comment/:id", function(req, res) {
    var commentId = req.params.id;
    Comment.findByIdAndRemove(commentId, function(err, todo) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/articles");
        }
    });
});


//save the article
router.post("/save/article/:id", function(req, res) {
    var articleId = req.params.id;
    Article.findByIdAndUpdate({ "_id": articleId}, {$set: {"saved": true}}, function(err, todo) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/articles");
        }
   
});  
});

//render the articles
router.get("/saved", function(req, res) {
    //mongo db results are displayed and sorted
    Article.find({"saved": true})
        .populate("comments")
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                var hbsObject = { articles: doc }
                res.render("saved", hbsObject);
                // res.json(hbsObject)
            }
        });
});

//export the route for server
module.exports = router;