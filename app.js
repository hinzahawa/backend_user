const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { Sequelize } = require("sequelize");
dotenv.config();
const config = require("./config");
const routes = require("./src/routes");
const app = express();
try {
  const sequelize = new Sequelize(
    config.DATABASE,
    config.DB_USERNAME,
    config.DB_PASSWORD,
    {
      host: config.DB_HOST,
      dialect: config.MYSQL,
    }
  );
  try {
    sequelize.authenticate();
    console.info("Connection has been mysql successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(cors());
    routes(app);

  const port = process.env.PORT || 3000;

  app.get("/", (req, re) => {
    res.sendStatus(200);
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });
  // sequelize.close();
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
