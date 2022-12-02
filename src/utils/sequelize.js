const { Sequelize } = require("sequelize");
const config = require("../../config");

const sequelize = new Sequelize(
  config.DATABASE,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: config.MYSQL,
  }
);

module.exports = sequelize;
