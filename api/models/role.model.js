// Load mongoose
const mongoose = require("mongoose");
const { logger, getResObject } = require("../helpers");

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
    result.message = roles ?? [];
  } catch (e) {
    result.error = true;
    result.errorCode = 500;
    result.message = e;
  }
  return result;
};

Role.transform = async (rolesIn = ["USER"]) => {
  try {
    logger(rolesIn, "transform params:");

    const allRolesObject = await Role.allRoles();
    const { isError, message: bdRoles } = allRolesObject;
    if (!isError && (bdRoles?.length ?? 0) > 0) {
      const rolesOut = rolesIn.map((roleIn) => {
        return bdRoles.find(
          (bdRole) =>
            bdRole.name.toUpperCase().trim() === roleIn.toUpperCase().trim()
        )?._id;
      });
      logger(rolesOut, "result rolesOut: ");
      return getResObject(rolesOut, 0);
    } else {
      return getResObject("roles empty in db", 401);
    }
  } catch (e) {
    console.error(e);
    return getResObject(e.message, 500);
  } finally {
  }
};

module.exports = Role;
