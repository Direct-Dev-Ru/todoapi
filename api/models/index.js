const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const config = require("../config");

const db = {};

db.mongoose = mongoose;
db.config = config;

db.user = require("./user.model");
db.role = require("./role.model");
db.todo = require("./todo.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
