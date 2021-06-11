const mongoose = require("mongoose");
const { logger, getResObject } = require("../helpers");

const userSchema = new mongoose.Schema({
  // login
  username: {
    type: String, // тип: String
    required: [true, "usernameRequired"],
    maxlength: [32, "usernameTooLong"],
    minlength: [3, "usernameTooShort"],
    match: [/^[a-z0-9]+$/, "usernameIncorrect"],
    unique: true,
    lowercase: true,
    trim: true
  },
  fullname: {
    type: String, // тип: String
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

User.getUser = async (filterValue, filterType = "email") => {
  // if U wanna by username - pass username string to filterType
  logger("finding user by " + filterType + ": ", "User.getUser :");
  const filter = {};
  filter[filterType] = filterValue.toLowerCase().trim();
  logger(filter, "User.getUser :");
  const user = await User.find(filter).populate("roles");

  if (!user) {
    logger(
      `find user by ${filterType} : ${user._id.toString()}`,
      "User.getUser :"
    );
    return user;
  }
  logger(` user by ${filterType} not found`, "User.getUser :");

  return null;
};

module.exports = User;
