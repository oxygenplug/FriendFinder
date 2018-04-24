var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var JSONStorage = require("node-localstorage").JSONStorage;
var storage = new JSONStorage("../data");

storage.setItem("users", []);
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

app.get("/api/friends", function(req, res) {
  return res.json(getUsers());
});

app.get("/api/users", function(req, res) {
  return res.send(users);
});

app.post("/api/users", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body-parser middleware
  var user = addUser(req.body);
  res.json(user);
});

app.get("/api/friends/match/:userId", function(req, res) {
  var users = getUsers();
  var userId = req.params.userId;
  var userIndex;

  var currentUser = users.find(function(val, index) {
    if (val.id == userId) {
      userIndex = index;
      return true;
    }
  });
  users.splice(userIndex, 1);
  var contenders = users;

  var differenceProfiles = [];

  contenders.forEach(function(val) {
    var scoreDifferences = [];
    val.scores.forEach(function(val, index) {
      var difference = val - currentUser.scores[index];
      scoreDifferences.push(Math.abs(difference));
    });

    var weightedDifferences = [];
    scoreDifferences.forEach(function(val, index, array) {
      if (val != 0) {
        val *= val + 1;
      }
      weightedDifferences.push(val);
    });
    var differenceSum = 0;
    for (const difference of weightedDifferences) {
      differenceSum += difference;
    }
    var differenceProfile = new DifferenceProfile(
      val.name,
      val.photo,
      val.routename,
      differenceSum
    );
    differenceProfiles.push(differenceProfile);
  });
  var bestMatch = new DifferenceProfile("", "", "", 201);
  differenceProfiles.forEach(function(val) {
    if (bestMatch.difference > val.difference) {
      bestMatch = val;
    }
  });
  res.json(bestMatch);
});

function User(newUser, id) {
  this.name = newUser.name;
  this.photo = "'" + newUser.photo + "'";
  this.scores = newUser.scores;
  this.id = id;
  this.routeName = newUser.name.replace(/\s+/g, "").toLowerCase();
}

function DifferenceProfile(name, photo, routeName, difference) {
  this.name = name;
  this.photo = photo;
  this.routeName = routeName;
  this.difference = difference;
}

function addUser(newUser) {
  var users = getUsers();
  var user = new User(newUser, users.length);
  users.push(user);
  setUsers(users);
  return user;
}

function getUsers() {
  return storage.getItem("users");
}

function setUsers(users) {
  storage.setItem("users", users);
}

app.listen(PORT, function(req, res) {
  console.log("Server listening on port: " + PORT);
  console.log(__dirname + "/../public/");
});
