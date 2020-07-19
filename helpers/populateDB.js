const users = require("./fakeUsers");
const mongoose = require("mongoose");
const User = require("../models/User");

mongoose.connect("mongodb://localhost/opinionrated", { useNewUrlParser: true });

console.log(users);

users.forEach((user) => {
  User.create(
    {
      username: user.username,
    },
    function(err, createdUser) {
      if (err) {
        console.log(err);
      } else {
        console.log("Success!");
        console.log(createdUser);
      }
    }
  );
});
