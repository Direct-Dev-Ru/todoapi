const db = require("../models");
const { logger, fakeRequest, fakeResponse } = require("../helpers");
const { getUser } = require("../models/user.model");

async function testAllRoles() {
  return await db.role.allRoles();
}

(async (db, test) => {
  const { signup } = require("../controllers");
  const { authJwt, verifySignUp } = require("../middleware");

  db.log = logger;
  db.mongoose.Promise = global.Promise;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    // serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };
  if (!db.connection) {
    console.log("connecting to mongo db ...");
    db.mongoose.connect(db.config.mongoUri, options);
    db.connection = db.mongoose.connection
      .then(async () => {
        db.log("connected to mongo db ...", "test logs: ");
        // const allRoles = await test.testAllRoles();
        // db.log(allRoles.message, "All Roles :");

        // const transRoles = await db.role.getDbIds(["ADMIN", "moderator"]);
        // db.log(transRoles, "transRoles result: ");
        let req = new fakeRequest({
          userId: null,
          body: {
            username: "Pasha",
            fullname: "Pavel Faker",
            email: "pavel@drom.ru",
            password: "durimar45",
            roles: ["user"]
          }
        });
        const res = new fakeResponse();
        // signup(req, res);

        // findUserTest
        let userFromBd = await db.user.getUser("admin", "username");
        const userId = userFromBd._id.toString();
        db.log(
          // JSON.stringify({ userId: userFromBd["_id"] }, null, "\t"),
          userId,
          "search user result: "
        );
        // db.log(userFromBd, "search user result 2: ");

        req = new fakeRequest({
          userId: userId,
          body: {
            roles: ["ADMIN", "USER"]
          }
        });

        db.log(req, "req: ");
        await authJwt.isRole("admin")(req, res, () =>
          db.log("passing success", "isRole: ")
        );
        await authJwt.isAdmin(req, res, () =>
          db.log("passing success", "isAdmin: ")
        );
        await authJwt.isModerator(req, res, () =>
          db.log("passing success", "isModerator: ")
        );
        await authJwt.isUser(req, res, () =>
          db.log("passing success", "isUser: ")
        );

        await verifySignUp.checkRolesExisted(req, res, () =>
          db.log("passing success", "verifySignUp: ")
        );
      })
      .catch((error) => console.log);
  } else {
    console.log("already connected");
  }
})(db, { testAllRoles, logger, fakeRequest, fakeResponse }).then(() =>
  console.log("end")
);
