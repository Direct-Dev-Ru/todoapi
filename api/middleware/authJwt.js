const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const { getResObject } = require("../helpers");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    // return res.status(403).send({ message: "No token provided!" });
    return res.status(200).send(getResObject("No token provided!", 403));
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(200).send(getResObject("Unauthorized!", 401));
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
        res.status(200).send(getResObject(`User ${req.userId} not found`, 404));
        return;
      }
      for (let i = 0; i < user?.roles.length ?? 0; i++) {
        if (user?.roles[i].name === roleToCheck) {
          next();
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

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "ADMIN") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require ADMIN Role!" });
        return;
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "MODERATOR") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require MODERATOR Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isRole,
  isModerator
};
module.exports = authJwt;
