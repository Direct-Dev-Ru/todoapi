const config = require("../config");
const db = require("../models");
const { getResObject } = require("../helpers");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const candidate = new User({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    resetPwd: true
  });
  try {
    let candidateRoles = req.body.roles ?? [];
    candidateRoles = Array.isArray(candidateRoles) ? candidateRoles : [];
    const bdRolesObject = await Role.getDbIds(candidateRoles);
    const { isError, message: bdRoles } = bdRolesObject;
    if (isError) {
      res.status(200).send(JSON);
      return;
    }
    candidate.roles = bdRoles;
    candidate.save();
  } catch (e) {
    res.status(200).send(getResObject(e, 500));
    return;
  }
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};
