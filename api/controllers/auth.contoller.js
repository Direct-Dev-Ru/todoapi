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
    let bdRoles = await Role.allRoles();
    bdRoles = bdRoles ?? [];
    const candidateRoles = req.body.roles ?? [];

    if (candidateRoles.length > 0 && (bdRoles ?? []).length === 0) {
      res.status(200).send(getResObject("No Roles in BD", 400));
      return;
    }
    candidate.roles = [];
    candidateRoles.forEach((candidateRole) => {
      const bdRole = bdRoles.find((role) => candidateRole === role.name);
      if (!bdRole) {
        res
          .status(200)
          .send(
            getResObject(
              `Can not map role ${candidateRole} to one of bdRoles`,
              400
            )
          );
        return;
      }
      candidate.roles.push(bdRole._id);
    });

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
