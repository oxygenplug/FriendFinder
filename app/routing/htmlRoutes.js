var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

var usersList = [];
// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//handles GET responses from the client
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

//posts the user submitted information to /api/users
app.post("/api/users", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body-parser middleware
  var user = addUser(req.body);
  res.json(user);
});

//handles the GET requests using the auto generated userid as the key to pass into the URL
app.get("/api/friends/match/:userId", function(req, res) {
// sets users to the list of users returned via the getUsers function
//
  var users = getUsers();
  var userId = req.params.userId;
  var userIndex;

  // finds current user in the array of users to ensure they do not match themslves 
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
    //commenting out localstorage solution to use serverside solution instead
  //return storage.getItem("users");
  return usersList;
}

function setUsers(users) {
    //commenting out localstorage solution to use serverside solution instead
  //storage.setItem("users", users);
  usersList.push(users);
}

app.listen(PORT, function(req, res) {
  console.log("Server listening on port: " + PORT);
  console.log(__dirname + "/../public/");
});
