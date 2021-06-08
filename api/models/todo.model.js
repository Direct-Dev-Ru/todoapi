const mongoose = require("mongoose");
// Create new scheme
const todoSchema = new mongoose.Schema({
  title: {
    type: String, // тип: String
    required: [true, "todoTitleRequired"],
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
