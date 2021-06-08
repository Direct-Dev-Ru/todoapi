const fs = require("fs"),
  path = require("path");
const defaultPath = path.join(__dirname, "db.json");

const readDb = (dbPath = defaultPath) =>
  new Promise(function (resolve, reject) {
    fs.readFile(dbPath, { encoding: "utf-8" }, function (err, data) {
      if (err) {
        console.log("received data error: " + err);
        return resolve({
          "Content-Type": "application/json",
          isError: true,
          data: null,
          error: err
        });
      }
      console.log("received data success: " + data);
      resolve({
        "Content-Type": "application/json",
        isError: false,
        data: JSON.parse(data),
        error: null
      });
    });
  });

module.exports.readDb = readDb;
