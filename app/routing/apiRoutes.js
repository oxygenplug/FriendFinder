var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var friends = [];

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function Friend(name, photo, scores) {
  this.name = name;
  this.photo = "'" + photo + "'";
  this.scores = scores;
}

function addFriend(name, photo, scores){
  var friends = new Friend(name, photo, scores);
    friends.push(table);
}

app.get("/api/friends", function(req, res) {
  return res.send(friends);
});

app.post("/api/friends", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body-parser middleware
  var newFriend = req.body;

  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  newFriend.routeName = newFriend.name.replace(/\s+/g, "").toLowerCase();

  console.log(newFriend);

  friends.push(newFriend);

  res.json(newFriend);
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});