var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/../public/", "home.html"));
});

app.get("/home", function(req, res) {
    res.sendFile(path.join(__dirname + "/../public/", "home.html"));
  });

app.get("/survey.html", function(req, res) {
  res.sendFile(path.join(__dirname + "/../public/", "survey.html"));
});


app.listen(PORT, function(req, res){
    console.log('Server listening on port: ' + PORT)
    console.log(__dirname + "/../public/");
});