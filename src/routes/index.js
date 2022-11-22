const authorization = require("../middleware/authorization");
const user = require("./users");

function routeAll(app) {
  app.use("/api/users", user);

}
module.exports = routeAll;
