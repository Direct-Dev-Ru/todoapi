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
    const roles = await Role.find({}).lean();
    result.message = roles ?? [];
  } catch (e) {
    result.error = true;
    result.errorCode = 500;
    result.message = e;
  }
  return result;
};

Role.getDbIds = async (rolesInParam = ["USER"]) => {
  try {
    const rolesIn = rolesInParam?.length === 0 ?? 0 ? ["USER"] : rolesInParam;
    logger(rolesIn, "transform params:");

    const allRolesObject = await Role.allRoles();
    const { isError, message: bdRoles } = allRolesObject;
    if (!isError && (bdRoles?.length ?? 0) > 0) {
      let result = null;
      const rolesOut = rolesIn.map((roleIn) => {
        const bdRoleId = bdRoles.find(
          (bdRole) =>
            bdRole.name.toUpperCase().trim() === roleIn.toUpperCase().trim()
        )?._id;
        if (!bdRoleId) {
          result = getResObject(
            `Role ${roleIn} not found in database ...`,
            404
          );
          return null;
        }
        return bdRoleId;
      });
      logger(rolesOut, "result rolesOut: ");
      return result ? result : getResObject(rolesOut, 0);
    } else {
      return getResObject("roles empty in db", 404);
    }
  } catch (e) {
    console.error(e);
    return getResObject(e.message, 500);
  } finally {
  }
};

module.exports = Role;
