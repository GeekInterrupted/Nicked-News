//require dependencies
var express = require("express");
var bodyParser = require("body-parser");
// var logger = require("morgan");
var mongoose = require("mongoose");

//scraping tools
var request = require("request");
var cheerio = require("cheerio");

//Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//initialize Express
var app = express();

//serve static content for the app from the public directory in the application directory
app.use(express.static(__dirname + "/public"));

//morgan and body parser
// app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//database configuration
var databaseUrl = "scraper";
var collections = ["scraped"];

//routes and controllers
var router = require("./controllers/controller.js");
app.use("/", router);

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  

var uristring =
    process.env.MONGODB_URI || 'mongodb://localhost/nickednews';

    // Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.

mongoose.connect(uristring, function(err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }

});
var db = mongoose.connection;


//start the app
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});