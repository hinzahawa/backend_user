const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const User = sequelize.define("users", {
  username: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  firstname: { type: DataTypes.STRING },
  surname: { type: DataTypes.STRING },
  birthday: { type: DataTypes.DATE },
});

module.exports = User;
