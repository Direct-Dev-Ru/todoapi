const db = require("../models");
const { logger, fakeRequest, fakeResponse } = require("../helpers");

async function testAllRoles() {
  return await db.role.allRoles();
}

(async (db, test) => {
  const { signup } = require("../controllers");
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
        console.log("connected to mongo db ...");
        // console.log(await test.testAllRoles());
        // const transRoles = await db.role.getDbIds(["ADMIN", "moderator"]);
        // db.log(transRoles, "transRoles result: ");
        const req = new fakeRequest({
          body: {
            username: "Pasha",
            fullname: "Pavel Faker",
            email: "pavel@drom.ru",
            password: "durimar45"
            // roles: ["mOdeRator"]
          }
        });
        const res = new fakeResponse();
        signup(req, res);
      })
      .catch((error) => console.log);
  } else {
    console.log("already connected");
  }
})(db, { testAllRoles, logger, fakeRequest, fakeResponse });
