const express = require("express");
const router = express.Router();
const dbService = require("./getDb");

router.get("/home", (req, res) => {
  res.send("This is a home router");
});

router.get("/profile", (req, res) => {
  res.send("This is a profile router");
});

router.get("/login", (req, res) => {
  res.send("This is a login router");
});

router.get("/api", (req, res) => {
  dbService.readDb().then((dbObject) => {
    console.log(dbObject);
    res.send(JSON.stringify(dbObject));
  });
});

module.exports = router;
