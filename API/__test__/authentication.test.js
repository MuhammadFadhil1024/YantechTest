const app = require("../index");
const request = require("supertest");
const { sequelize } = require("../models");

const UserData = {
  name: "Muhammad Fadhil Nurhuda",
  email: "fadhil@gmail.com",
  password: "fadhil123",
};

let refreshToken;

// test for endpoint register user
describe("POST /api/register", () => {
  it("should send response with a 201 status code", async () => {
    const res = await request(app).post("/api/register").send({
      name: UserData.name,
      email: UserData.email,
      password: UserData.password,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.code).toBe(201);
    expect(res.body.status).toBe("CREATED");
    expect(res.body.data).toBeDefined();
  });

  it("should send response with a 400 status code because email is already registered", async () => {
    const res = await request(app).post("/api/register").send({
      name: "Muhammad Fadhil Nurhuda",
      email: "fadhil@gmail.com",
      password: "fadhil123",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.code).toBe(400);
    expect(res.body.status).toBe("BAD_REQUEST");
  });

  it("should send response with a 400 status code because email is null", async () => {
    const res = await request(app).post("/api/register").send({
      name: UserData.name,
      email: null,
      password: UserData.password,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.code).toBe(400);
    expect(res.body.status).toBe("BAD_REQUEST");
  });

  it("should send response with a 400 status code because password is null", async () => {
    const res = await request(app).post("/api/register").send({
      name: UserData.name,
      email: UserData.email,
      password: null,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.code).toBe(400);
    expect(res.body.status).toBe("BAD_REQUEST");
  });
});

// test for endpoint login
describe("POST /api/login", () => {
  it("should send response with a 200 status code succes login", async () => {
    const res = await request(app).post("/api/login").send({
      email: UserData.email,
      password: UserData.password,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toHaveProperty("accessToken");

    // check refresh token on cookie has been set
    const refreshTokenCookie = res.headers["set-cookie"].find((cookie) =>
      cookie.startsWith("refreshToken=")
    );
    expect(refreshTokenCookie).toBeDefined();

    // Split the cookie string by the semicolon and get the first part (the token)
    refreshToken = refreshTokenCookie.split(";")[0].split("=")[1];
  });

  it("should response with a 400 because empety email or password", async () => {
    const res = await request(app).post("/api/login").send({
      email: "",
      password: UserData.password,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.code).toBe(400);
    expect(res.body.status).toBe("BAD_REQUEST");
  });

  it("should response with a 401 because user not found", async () => {
    const res = await request(app).post("/api/login").send({
      email: "wrongEmail@gmail.com",
      password: UserData.password,
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.code).toBe(401);
    expect(res.body.status).toBe("UNAUTHORIZED");
  });

  it("should response with a 401 because incorrect password", async () => {
    const res = await request(app).post("/api/login").send({
      email: UserData.email,
      password: "wrongPassword",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.code).toBe(401);
    expect(res.body.status).toBe("UNAUTHORIZED");
  });
});

// test for endpoint /api/refresh
describe("POST /api/refresh", () => {
  it("should response with 200 succes for refresh token", async () => {
    const res = await request(app)
      .post("/api/refresh")
      .set("Cookie", [`refreshToken=${refreshToken}`]);
    expect(res.statusCode).toEqual(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("should response with 401 becaouse refreshtoken on cookie empty", async () => {
    const res = await request(app).post("/api/refresh");
    expect(res.statusCode).toEqual(401);
    expect(res.body.code).toBe(401);
    expect(res.body.status).toBe("UNAUTHORIZED");
  });

  it("should response with 401 becaouse refreshtoken on cookie is not valid", async () => {
    const res = await request(app)
      .post("/api/refresh")
      .set("Cookie", [`refreshToken=wrongrefreshtoken`]);
    expect(res.statusCode).toEqual(401);
    expect(res.body.code).toBe(401);
    expect(res.body.status).toBe("UNAUTHORIZED");
  });
});

// test for endpoint /api/logout
describe("POST /api/logout", () => {
  it("should response with 200 succes for remove refreshToken from cookie", async () => {
    const res = await request(app)
      .post("/api/logout")
      .set("Cookie", [`refreshToken=${refreshToken}`]);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
    // Check if the "refreshToken" cookie is removed
    const setCookieHeader = res.headers["set-cookie"];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader).toHaveLength(1);
    expect(setCookieHeader[0]).toMatch(/refreshToken=;/);
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("users", null, {});
});
