const db = require("../models");
const Role = db.roles;
const User = db.user;

const checkUsernameOrEmailDuplication = async (req, res, next) => {
  try {
    const clientUsername = req.body.username.toLowerCase().trim();
    const user = await User.findOne({
      username: clientUsername
    });
    if (user) {
      res.status(200).send({
        isError: true,
        errorCode: 400,
        message: `Failed! Username ${clientUsername} is already in use!`
      });
      return;
    }
  } catch (e) {
    res.status(200).send({ isError: true, errorCode: 500, message: e });
    return;
  }

  try {
    const clientEmail = req.body.email.toLowerCase().trim();
    const user = await User.findOne({
      email: clientEmail
    });
    if (user) {
      res.status(200).send({
        isError: true,
        errorCode: 400,
        message: `Failed! Username with email ${clientEmail} is already in use!`
      });
      return;
    }
  } catch (e) {
    res.status(200).send({ isError: true, errorCode: 500, message: e });
    return;
  }

  next();
};

const checkRolesExisted = async (req, res, next) => {
  try {
    if (req.body.roles) {
      const allRoles = await Role.allRoles();
      if (allRoles.isError) {
        res.status(200).send({ ...allRoles });
        return;
      }
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!allRoles.message.includes(req.body.roles[i])) {
          res.status(200).send({
            isError: true,
            errorCode: 400,
            message: `Failed! Role ${req.body.roles[i]} does not exist in database!`
          });
          return;
        }
      }
    }
  } catch (e) {
    res.status(200).send({ isError: true, errorCode: 500, message: e });
    return;
  }

  next();
};

const verifySignUp = {
  checkUsernameOrEmailDuplication,
  checkRolesExisted
};

module.exports = verifySignUp;
