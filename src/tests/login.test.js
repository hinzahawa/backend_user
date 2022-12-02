const request = require("supertest");
const { Sequelize } = require("sequelize");
const config = require("../../config");
const app = require("../../app");
const sequelize = new Sequelize(
  config.DATABASE,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: config.MYSQL,
  }
);

describe("POST /api/users/login", () => {
  beforeAll(async () => {
    /* Connecting to the database before each test. */
    await sequelize.authenticate();
  });
  afterAll(async () => {
    /* Closing database connection after each test. */
    sequelize.close();
  });
  it("should return username required", async () => {
    const res = await request(app).post("/api/users/login");
    expect(res.statusCode).toBe(400);
    expect(Object.keys(res.body).length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty(
      "message",
      expect.stringMatching(/username required/)
    );
  });
  it("should return password required", async () => {
    const req = { username: "test1" };
    const res = await request(app).post("/api/users/login").send(req);
    expect(res.statusCode).toBe(400);
    expect(Object.keys(res.body).length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty(
      "message",
      expect.stringMatching(/password required/)
    );
  });
  it("should return username or password invalid", async () => {
    const req = { username: "test", password: "xxx" };
    const res = await request(app).post("/api/users/login").send(req);
    expect(res.statusCode).toBe(400);
    expect(Object.keys(res.body).length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty(
      "message",
      expect.stringMatching(/username or password invalid/)
    );
  });
  it("should return auth token", async () => {
    const req = { username: "test1", password: "123" };
    const res = await request(app).post("/api/users/login").send(req);
    expect(res.statusCode).toBe(200);
    expect(Object.keys(res.body).length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty(
      "message",
      expect.stringMatching(/login successfully/)
    );
    expect(res.body).toHaveProperty("token",expect.stringMatching(/ey/));
  });
});
