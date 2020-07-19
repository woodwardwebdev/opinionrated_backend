// NOTE - to run db in terminal, run this: mongod --dbpath=/Users/shared/data/db

require("dotenv").config();
// package requirements
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Opinion_Question = require("./models/Opinion_Question");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const User = require("./models/User");
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

// mongoose.connect(
//   "mongodb+srv://colin:" +
//     process.env.ATLASPASS +
//     "@firstcluster-ggfnz.mongodb.net/test?retryWrites=true&w=majority",
//   { useNewUrlParser: true }
// );
mongoose.connect("mongodb://localhost/opinionrated", { useNewUrlParser: true });

// use statements and view setting
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors({ origin: "https://localhost:3000" }));
app.use(cors());

app.use(express.static("public"));
app.use(cookieParser());
app.use(expressSession({ secret: "not today idiot" }));
app.use(passport.initialize());
app.use(passport.session());

// passport config

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

// Opinion_Question.create(
//   {
//     question: "Will this every actually work?",
//     upvotes: 0,
//     downvotes: 0,
//   },
//   function(err, createdPost) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Success!");
//       console.log(createdPost);
//     }
//   }
// );

app.options("*", cors());

// home page route

// ROUTES TO GET DATA ON USERS AND QUESTIONS

app.get("/getusers", cors(), function(req, res) {
  User.find().exec(function(err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      res.json(foundUsers);
    }
  });
});

// Find a single User
app.get("/getusers/:id", cors(), function(req, res) {
  User.findOne({ _id: req.params.id }).exec(function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.json(foundUser);
      console.log(foundUser);
    }
  });
});

app.get("/getopinions", cors(), function(req, res) {
  Opinion_Question.find()
    .sort({ date: -1 })
    .exec(function(err, foundposts) {
      if (err) {
        console.log(err);
      } else {
        res.json(foundposts);
      }
    });
});

// THESE ROUTES RELATE TO SINGLE QUESTION INTERACTIONS - UPVOTES/DOWNVOTES ETC
// Create a question tied to your username
app.post("/singlequestion", cors(), function(req, res) {
  Opinion_Question.create({
    createdBy: req.body.createdBy,
    question: req.body.question,
    upvotes: 0,
    downvotes: 0,
  }).then(function(err, createdQuestion) {
    if (err) {
      console.log(err);
    } else {
      User.findOneAndUpdate(
        { username: createdQuestion.createdBy },
        { $push: { createdQuestions: createdQuestion._id } }
      ).exec(function(err, updatedUser) {
        if (err) {
          console.log(err);
        } else {
          console.log(updatedUser);
        }
        console.log(createdQuestion);
      });
    }
  });
});

// single Question Update Routes
app.get("/singlequestion/:id", cors(), function(req, res) {
  Opinion_Question.findById(req.params.id).exec(function(err, foundposts) {
    if (err) {
      console.log(err);
    } else {
      res.json(foundposts);
    }
  });
});

app.post("/singlequestion/:id", cors(), function(req, res) {
  console.log(req.body);
  Opinion_Question.findOneAndUpdate(
    { _id: req.body._id },
    {
      $push: {
        answers: { answerer: req.body.user, answer: req.body.answer },
        answeredBy: req.body.user,
      },
    }
  ).exec(function(err, updatedQuestion) {
    if (err) {
      console.log(err);
    } else {
      console.log(updatedQuestion);
    }
  });
});

// Voting Logging
app.post("/singlequestionvote/:id", cors(), function(req, res) {
  console.log("current User is --- " + req.body.currentUser);
  Opinion_Question.findByIdAndUpdate(req.params.id, {
    upvotes: req.body.upvotes,
    downvotes: req.body.downvotes,
  }).exec(function(err, updatedquestion) {
    if (err) {
      console.log(err);
    } else {
      console.log();
    }
    User.findOneAndUpdate(
      { _id: req.body.currentUser },
      {
        $push: { hasVotedOn: req.params.id },
      }
    ).exec(function(err, updatedUser) {
      if (err) {
        console.log(err);
      } else {
        res.json(updatedUser);
      }
    });
  });
});

// sets up the listener
app.listen(1337, function() {
  console.log("Server has started.");
});
