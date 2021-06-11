const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const { logger, getResObject } = require("../helpers");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    // return res.status(403).send({ message: "No token provided!" });
    return res.status(200).json(getResObject("No token provided!", 403));
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(200).json(getResObject("Unauthorized!", 401));
    }
    req.userId = decoded.id;
    next();
  });
};

const isRole = (roleToCheck) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).populate("roles");
      if (!user) {
        res.status(200).json(getResObject(`User ${req.userId} not found`, 404));
        return;
      }
      for (let i = 0; i < user?.roles.length ?? 0; i++) {
        if (user?.roles[i].name === roleToCheck.toUpperCase().trim()) {
          if (next) next();
          logger(
            `Role ${roleToCheck} presents in user ${req.userId} roles`,
            "isRole :"
          );
          return;
        }
      }
      res.status(200).send(getResObject(`Require ${roleToCheck} Role!`, 403));
      return;
    } catch (e) {
      res.status(200).send(getResObject(e, 401));
      return;
    }
  };
};

const isAdmin = (req, res, next) => isRole("ADMIN");

const isModerator = (req, res, next) => isRole("MODERATOR");

const isUser = (req, res, next) => isRole("USER");

const authJwt = {
  verifyToken,
  isAdmin,
  isRole,
  isModerator
};
module.exports = authJwt;
