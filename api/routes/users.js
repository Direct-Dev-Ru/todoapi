const express = require("express");
const router = express.Router();
const { user: User } = require("../models");
// const config = require("./config");
// const db = require("./models");
const { wrapAsync, getResObject } = require("../helpers");

/* GET users listing. */
router.get(
  "/",
  wrapAsync(async function (req, res, next) {
    let allUsers = await User.find({}).populate("roles");
    allUsers = null;
    console.log(allUsers);
    console.log(allUsers[0].roles[0]);
    res.status(200).json(getResObject(allUsers, 0));
  })
);

module.exports = router;
