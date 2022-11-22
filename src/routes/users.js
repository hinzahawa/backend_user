const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const querySerializer = require("../helper/query_serializer");
const { SECRET_KEY } = require("../../config");
const jwt = require("jsonwebtoken");
const authorization = require("../middleware/authorization");
const MD5 = require("crypto-js/MD5");

async function login(req, res) {
  const { username, password } = req.body;
  try {
    if (!username)
      return res.status(400).json({ message: "username required." });
    if (!password)
      return res.status(400).json({ message: "password required." });
    const query = querySerializer(req.body);
    query.where.password = MD5(query.where.password).toString();
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
    if (!userData.username) {
      return res.status(400).json({ message: "username required." });
    }
    const isExistUsername = await UserModel.findOne({
      where: { username: userData.username },
      attributes: ["id", "username"],
    });
    if (isExistUsername)
      return res.status(422).json({ message: "username already exists." });
    if (userData.password)
      userData.password = MD5(userData.password).toString();
    const {
      dataValues: { id },
    } = await UserModel.create({ ...userData });
    if (id) return res.status(201).json({ message: "register successfully." });
    else return res.status(422).json({ message: "register failed." });
  } catch (error) {
    throw error;
  }
}
router.post("/login", login);
router.post("/", authorization, register);
router.post("/", authorization, register);

module.exports = router;
