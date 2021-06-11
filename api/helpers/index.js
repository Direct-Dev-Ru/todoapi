const resHelpers = require("./response");
const reqHelpers = require("./request");

const mainHelper = {};

mainHelper.logger = (message, id) => {
  if (process.env.LOG) {
    console.log("--------------");
    console.log(id ? id.toString() : "some log :", message);
  }
};

mainHelper.wrapAsync = function wrapAsync(fn) {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};

module.exports = { ...mainHelper, ...resHelpers, ...reqHelpers };
