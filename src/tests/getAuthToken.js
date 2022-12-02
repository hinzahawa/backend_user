const request = require("supertest");
const app = require("../../app");

module.exports = async () => {
  const req = { username: "test1", password: "123" };
  const res = await request(app).post("/api/users/login").send(req);
  return res.body.token;
};
