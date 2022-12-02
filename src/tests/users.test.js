const request = require("supertest");
const { Sequelize } = require("sequelize");
const config = require("../../config");
const app = require("../../app");
const getAuthToken = require("./getAuthToken.js");
const sequelize = new Sequelize(
  config.DATABASE,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: config.MYSQL,
  }
);
describe("GET /api/users", () => {
  let authToken = "";
  beforeAll(async () => {
    /* Connecting to the database before each test. */
    await sequelize.authenticate();
    authToken = await getAuthToken();
  });
  afterAll(async () => {
    /* Closing database connection after each test. */
    sequelize.close();
  });
  it("should return 401 unauthorize", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(401);
    expect(Object.keys(res.body).length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty(
      "message",
      expect.stringMatching(/Unauthorized/)
    );
  });
  it("should return users data", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });
  it("should return users data by id", async () => {
    const res = await request(app)
      .get("/api/users?id=8")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
    expect(res.body[0]).toHaveProperty("id", 8);
  });
});
