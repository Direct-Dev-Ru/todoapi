const express = require("express");
const router = express.Router();
const { user: User } = require("../models");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const allUsers = await User.find({}).populate("roles");
    console.log(allUsers);
    console.log(allUsers[0].roles[0]);
    res.send(JSON.stringify(allUsers));
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
