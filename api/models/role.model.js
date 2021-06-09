// Load mongoose
const mongoose = require("mongoose");
const { getResObject } = require("../helpers");
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

Role.allRoles = async () => {
  let result = getResObject("", 0);
  try {
    const roles = await Role.find({});
    result.message = roles;
  } catch (e) {
    result.error = true;
    result.errorCode = 500;
    result.message = e;
  }
  return result;
};

module.exports = Role;
