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
describe("test --> /api/users", () => {
  let authToken = "";
  let fakeUser = {
    username: "test98",
    firstname: "test",
  };
  beforeAll(async () => {
    /* Connecting to the database before each test. */
    await sequelize.authenticate();
    authToken = await getAuthToken();
  });
  afterAll(async () => {
    /* Closing database connection after each test. */
    sequelize.close();
  });
  describe("GET /api/users", () => {
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

  describe("POST /api/users", () => {
    it("should return 401 unauthorize", async () => {
      const res = await request(app).post("/api/users");
      expect(res.statusCode).toBe(401);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/Unauthorized/)
      );
    });

    it("should return create register successfully", async () => {
      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${authToken}`)
        .send(fakeUser);
      fakeUser.id = res.body.id;
      expect(res.statusCode).toBe(201);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/register successfully/)
      );
    });

    it("should return username already exists", async () => {
      fakeUser.username = "test1";
      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${authToken}`)
        .send(fakeUser);
      expect(res.statusCode).toBe(422);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/username already exists/)
      );
    });
  });

  describe("PUT /api/users", () => {
    it("should return 401 unauthorize", async () => {
      const res = await request(app).post("/api/users");
      expect(res.statusCode).toBe(401);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/Unauthorized/)
      );
    });

    it("should return id required.", async () => {
      const res = await request(app)
        .put("/api/users")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});
      expect(res.statusCode).toBe(400);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/id required/)
      );
    });

    it("should return id not found.", async () => {
      const res = await request(app)
        .put("/api/users")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ id: 99999 });
      expect(res.statusCode).toBe(422);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/id not found/)
      );
    });

    it("should return updated successfully", async () => {
      fakeUser = { id: fakeUser.id, firstname: "test13" };
      const res = await request(app)
        .put("/api/users")
        .set("Authorization", `Bearer ${authToken}`)
        .send(fakeUser);
      expect(res.statusCode).toBe(200);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/updated successfully/)
      );
    });
  });

  describe("DELETE /api/users", () => {
    it("should return 401 unauthorize", async () => {
      const res = await request(app).delete("/api/users");
      expect(res.statusCode).toBe(401);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/Unauthorized/)
      );
    });

    it("should return id required.", async () => {
      const res = await request(app)
        .delete("/api/users")
        .set("Authorization", `Bearer ${authToken}`)
      expect(res.statusCode).toBe(400);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/id required/)
      );
    });
    it("should return id not found.", async () => {
      const res = await request(app)
        .delete("/api/users?id=99999")
        .set("Authorization", `Bearer ${authToken}`)
      expect(res.statusCode).toBe(422);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/id not found/)
      );
    });
    it("should return id deleted successfully.", async () => {
      const res = await request(app)
        .delete("/api/users?id="+fakeUser.id)
        .set("Authorization", `Bearer ${authToken}`)
      expect(res.statusCode).toBe(200);
      expect(Object.keys(res.body).length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty(
        "message",
        expect.stringMatching(/deleted successfully/)
      );
    });
  });
});
