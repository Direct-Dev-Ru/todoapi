#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require("../app");
const debug = require("debug")("api:server");
const http = require("http");
const db = require("../models");
const bcrypt = require("bcryptjs");
let server = null;

(async function (db, server) {
  console.log("1.main f starts");
  const connectDb = async (initial = true) => {
    console.log("2.connectDb f starts");
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
    try {
      await db.mongoose.connect(db.config.mongoUri, options);
      db.connection = db.mongoose.connection;
      db.about = "todoapp";
      console.log("2.connectDb function step 2 starts");
      if (initial) {
        console.log("connected to mongo db " + db.about);
        startServer();
        initialAsync(db, false);
      }
    } catch (error) {
      console.log("Connect MongoDb Error: ", error);
    }

    return db.mongoose.connection;
    //return db.connection;
  };

  const startServer = () => {
    /**
     * Get port from environment and store in Express.
     */
    console.log("starting server ...");
    const defaultPort = "8080";
    const port = normalizePort(process.env.PORT || defaultPort);
    app.set("port", port);
    /**
     * Create HTTP server.
     */
    server = http.createServer(app);
    /**
     * Normalize a port into a number, string, or false.
     */
    function normalizePort(val) {
      const port = parseInt(val, 10);
      if (isNaN(port)) {
        // named pipe
        return val;
      }
      if (port >= 0) {
        // port number
        return port;
      }
      return false;
    }
    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
      if (error.syscall !== "listen") {
        throw error;
      }

      var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      const addr = server.address();
      const bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
      debug("Listening on " + bind);
    }

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  };

  /**
   * Function for create document in collection via model.
   */
  async function createAsync(objToCreate, model) {
    try {
      return await model.create(objToCreate);
    } catch (e) {
      throw new Error(e);
    }
  }

  async function initialAsync(db, drop = false) {
    if (!db) {
      return new Error("No dbConnection provided ...");
    }
    try {
      if (drop) {
        await db.user.collection.drop();
      }
      const rolesInUsers = await db.user.estimatedDocumentCount();
      // const rolesinDbcount = await db.role.estimatedDocumentCount();
      if (rolesInUsers === 0) {
        const initUser = { ...db.config.admin };
        const initRoles = [...db.config.roles];
        try {
          await db.role.collection.drop();
        } catch (e) {}

        for (const initRole of initRoles) {
          const newRole = await createAsync({ name: initRole }, db.role);
          console.log(
            `added ${newRole?._id} - ${newRole?.name} to roles collection`
          );
        }

        if (initRoles) {
          const initUserRoles = await db.role.find({
            name: { $in: initRoles }
          });

          initUser.roles = initUserRoles.map((role) => role._id);
          initUser.password = bcrypt.hashSync(initUser.password, 8);
          const newUser = await createAsync(initUser, db.user);
          console.log(
            `added user ${newUser?._id} - ${newUser?.username} to roles collection`
          );
        }
      }
    } catch (e) {
      console.log("init db error: ", e);
    }
  }

  connectDb(true).then(() => {
    db.mongoose.connection
      .on("error", (e) => {
        console.log("MongoDb error:", e);
        process.exit();
      })
      .on("disconnected", () => connectDb(false));
  });
})(db, server);

module.exports = { db, server };
