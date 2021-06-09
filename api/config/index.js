const MONGOURI =
  "mongodb+srv://CloudUser:6xsFkVqLfcRLZ6z@cluster0.ktrxb.azure.mongodb.net/todoapp?retryWrites=true&w=majority";

module.exports = {
  mongoUri: MONGOURI,
  secret: "fjsdiovfywefyba423234sd53268aguhq4234eraghvnfadjiv24523",
  roles: ["admin", "moderator", "user", "guest"],
  admin: {
    username: "admin",
    email: "admin@admin.com",
    password: "PaSsWoRd",
    resetPwd: true,
    roles: ["admin", "moderator"]
  }
};
