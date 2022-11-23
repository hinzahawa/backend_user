const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const querySerializer = require("../helper/query_serializer");
const { SECRET_KEY } = require("../../config");
const jwt = require("jsonwebtoken");
const authorization = require("../middleware/authorization");
const MD5 = require("crypto-js/MD5");
const { Op } = require("sequelize");

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
    if (!userData.username)
      return res.status(400).json({ message: "username required." });
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
async function getUserByQuery(req, res) {
  let query = querySerializer(req.query);
  try {
    if (Object.keys(query).length === 0) {
      const userId = req.user.id;
      query = { where: { id: { [Op.ne]: userId } } };
    }
    const data = await UserModel.findAll({
      ...query,
    });
    return res.json(data);
  } catch (error) {
    throw error;
  }
}
async function updateUser(req, res) {
  const userData = req.body;
  try {
    if (!userData.id) return res.status(400).json({ message: "id required." });
    const isIdExists = await UserModel.findByPk(userData.id, {
      attributes: ["id", "username"],
    });
    if (!isIdExists) return res.status(422).json({ message: "id not found." });
    // if (userData.username === isIdExists.dataValues.username)
    //   return res.status(422).json({ message: "username already exists." });
    if (userData.password)
      userData.password = MD5(userData.password).toString();
    if (userData.username) delete userData.username;
    if (userData.createdAt) delete userData.createdAt;
    if (userData.updatedAt) delete userData.updatedAt;
    const filter = { where: { id: userData.id } };
    const [update] = await UserModel.update(userData, filter);
    if (update > 0)
      return res.json({ update, message: "updated successfully." });
    else return res.status(422).json({ update, message: "updated nothing." });
  } catch (error) {
    throw error;
  }
}
async function deleteUser(req, res) {
  const { id } = req.query;
  try {
    if (!id) return res.status(400).json({ message: "id required." });
    const isIdExists = await UserModel.findByPk(id, {
      attributes: ["id"],
    });
    if (!isIdExists) return res.status(422).json({ message: "id not found." });
    const filter = { where: { id } };
    const result = await UserModel.destroy(filter);
    if (result > 0)
      return res.json({ result, message: "deleted successfully." });
    else return res.status(422).json({ result, message: "deleted nothing." });
  } catch (error) {
    throw error;
  }
}
router.post("/login", login);
router.post("/", authorization, register);
router.get("/", authorization, getUserByQuery);
router.put("/", authorization, updateUser);
router.delete("/", authorization, deleteUser);

module.exports = router;
