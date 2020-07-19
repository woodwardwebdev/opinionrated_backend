const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Opinion_Question = new Schema(
  {
    createdBy: String,
    question: String,
    date: {
      type: Date,
      default: new Date().toISOString().slice(0, 10),
    },
    answers: [],
    answeredBy: [],
    upvotes: Number,
    downvotes: Number,
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Opinion_Question", Opinion_Question);
