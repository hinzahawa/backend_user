const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const querySerializer = require("../helper/query_serializer");
const { SECRET_KEY } = require("../../config");
const jwt = require("jsonwebtoken");
const authorization = require("../middleware/authorization");
const MD5 = require("crypto-js/MD5");

async function login(req, res) {
  const query = querySerializer(req.body);
  try {
    const isExistUser = await UserModel.findOne({
      ...query,
      attributes: ["id", "username"],
    });
    if (isExistUser) {
      const userData = isExistUser.toJSON();
      const token = await jwt.sign(userData, SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "24h",
      });
      return res.json({ message: "login successfully.", token });
    } else
      return res.status(400).json({ message: "username or password invalid!" });
  } catch (error) {
    throw error;
  }
}

async function register(req, res) {
  const userData = req.body;
  try {
    if (userData.password)
      userData.password = MD5(userData.password).toString();
    const {
      dataValues: { id },
    } = await UserModel.create({ ...userData });
    if (id) res.status(201).json({ message: "register successfully." });
    else res.status(422).json({ message: "register failed." });
  } catch (error) {
    throw error;
  }
}
router.post("/login", login);
router.post("/register", register);

module.exports = router;
