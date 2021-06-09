// Load mongoose
const mongoose = require("mongoose");
// Create new scheme
const userSchema = new mongoose.Schema({
  // login
  username: {
    type: String, // тип: String
    required: [true, "usernameRequired"],
    maxlength: [32, "usernameTooLong"],
    minlength: [6, "usernameTooShort"],
    match: [/^[a-z0-9]+$/, "usernameIncorrect"],
    unique: true,
    lowercase: true,
    trim: true
  },
  // email
  email: {
    type: String, // тип: String
    required: [true, "emailRequired"],
    maxlength: [256, "emailTooLong"],
    match: [/[A-Z0-9._%+-]+@[A-Z0-9-]+.+\.[A-Z]{2,4}/gim, "emailIncorrect"],
    unique: true,
    lowercase: true,
    trim: true
  },
  // Пароль
  password: {
    type: String,
    maxlength: [32, "tooLong"],
    minlength: [8, "tooShort"],
    match: [/^[A-Za-z0-9]+$/, "passwordIncorrect"],
    required: [true, "passwordRequired"]
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  resetPwd: {
    type: Boolean,
    default: true
  },
  title: {
    type: String, // тип: String
    trim: true
  },
  department: {
    type: String, // тип: String
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

const User = mongoose.model("User", userSchema);
module.exports = User;
