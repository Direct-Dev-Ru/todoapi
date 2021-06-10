const db = require("../models");

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
    .then(() => {
      console.log("connected to mongo db ..." + db.about);
    })
    .catch((error) => console.log);
} else {
  console.log("already connected");
}
