// Load mongoose
const mongoose = require("mongoose");
// Create new scheme
const roleSchema = new mongoose.Schema({
  name: {
    type: String, // тип: String
    required: [true, "rolenameRequired"],
    unique: true,
    uppercase: true,
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

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
