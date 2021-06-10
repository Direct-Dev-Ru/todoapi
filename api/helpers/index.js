const resHelpers = require("./response");

const mainHelper = {};

mainHelper.logger = (message, id) => {
  if (process.env.LOG) {
    console.log("--------------");
    console.log(id ? id.toString() : "some log :", message);
  }
};

module.exports = { ...mainHelper, ...resHelpers };
