const express = require("express");
const app = express();
const mainRouter = require("./router");

app.use("/", mainRouter);

module.exports = app;
