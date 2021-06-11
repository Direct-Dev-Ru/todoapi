const db = require("../models");
const { getResObject } = require("../helpers");
const { log } = require("debug");
const Role = db.role;
const User = db.user;

const checkUsernameOrEmailDuplication = async (req, res, next) => {
  try {
    const clientUsername = req.body.username.toLowerCase().trim();
    const user = await User.findOne({
      username: clientUsername
    });
    if (user) {
      res
        .status(200)
        .send(
          getResObject(
            `Failed! Username ${clientUsername} is already in use!`,
            400
          )
        );
      return;
    }
  } catch (e) {
    res.status(200).send(getResObject(e, 401));
    return;
  }

  try {
    const clientEmail = req.body.email.toLowerCase().trim();
    const user = await User.findOne({
      email: clientEmail
    });
    if (user) {
      res
        .status(200)
        .send(
          getResObject(
            `Failed! Username with email ${clientEmail} is already in use!`,
            400
          )
        );
      return;
    }
  } catch (e) {
    res.status(200).send(getResObject(e, 500));
    return;
  }

  next();
};

const checkRolesExisted = async (req, res, next) => {
  try {
    if (req.body.roles) {
      const allRoles = await Role.allRoles();
      if (allRoles.isError) {
        res
          .status(200)
          .json(getResObject(allRoles.message, allRoles.errorCode));
        return;
      }
      const bdRoles = allRoles.message;
      //db.log(bdRoles, "checkRolesExisted :");
      for (let i = 0; i < req.body.roles.length; i++) {
        if (
          !bdRoles.find(
            (bdRole) => req.body.roles[i].toUpperCase().trim() === bdRole.name
          )
        ) {
          res
            .status(200)
            .json(
              getResObject(
                `Failed! Role ${req.body.roles[i]} does not exist in database!`,
                404
              )
            );
          return;
        }
      }
    }
  } catch (e) {
    res.status(200).send(getResObject(e, 500));
    return;
  }

  next();
};

const verifySignUp = {
  checkUsernameOrEmailDuplication,
  checkRolesExisted
};

module.exports = verifySignUp;
