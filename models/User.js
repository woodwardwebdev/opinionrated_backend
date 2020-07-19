const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const User = new Schema({
  username: String,
  createdQuestions: [],
  agreeQuestions: [],
  disagreeQuestions: [],
  hasVotedOn: [],
});

module.exports = Mongoose.model("User", User);
