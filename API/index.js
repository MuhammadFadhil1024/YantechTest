require("dotenv").config();
const { comparePassword } = require("./helpers/bcrypt");
const {
  generateToken,
  generateRefreshToken,
  compareRefreshToken,
} = require("./helpers/jwt");
const { users } = require("./models");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT;
const env = process.env.NODE_ENV;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// endpoint for register new user
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await users.create({
      name,
      email,
      password,
    });

    const response = {
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return res.status(201).json({
      code: 201,
      status: "CREATED",
      data: response,
    });
  } catch (e) {
    if (
      e.name === "SequelizeValidationError" ||
      e.name === "SequelizeUniqueConstraintError"
    ) {
      const validationError = {};
      e.errors.map((er) => {
        validationError[er.path] = er.message;
      });
      return res.status(400).json({
        code: 400,
        status: "BAD_REQUEST",
        error: validationError,
      });
    } else {
      return res.status(500).json({ error: e });
    }
  }
});

// endpoint for login user
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        status: "BAD_REQUEST",
        error: "email or password can't be empty",
      });
    }

    const userLogin = await users.findOne({
      where: {
        email: email,
      },
    });

    if (!userLogin) {
      return res.status(401).json({
        code: 401,
        status: "UNAUTHORIZED",
        error: `User not found`,
      });
    }

    const isValidPassword = comparePassword(password, userLogin.password);

    if (isValidPassword) {
      const payload = {
        id: userLogin.id,
        name: userLogin.name,
        email: userLogin.email,
      };

      const accessToken = generateToken(payload);
      const refreshtoken = generateRefreshToken({
        email: email,
      });

      //   assign refrestoken to cookies
      res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      const response = {
        id: userLogin.id,
        name: userLogin.name,
        email: userLogin.email,
        accessToken: accessToken,
      };

      return res.status(200).json({
        code: 200,
        status: "SUCCESS",
        data: response,
      });
    } else {
      return res.status(401).json({
        code: 401,
        status: "UNAUTHORIZED",
        error: "Incorrect password!",
      });
    }
  } catch (e) {
    if (
      e.name === "SequelizeValidationError" ||
      e.name === "SequelizeUniqueConstraintError"
    ) {
      const validationError = {};
      e.errors.map((er) => {
        validationError[er.path] = er.message;
      });
      return res.status(400).json({
        code: 400,
        status: "BAD_REQUEST",
        error: validationError,
      });
    } else {
      return res.status(500).json({ error: e });
    }
  }
});

// endoint for refresh token
app.post("/api/refresh", async (req, res) => {
  if (req.cookies?.refreshToken) {
    const refreshToken = req.cookies.refreshToken;
    const isValidRefreshToken = compareRefreshToken(refreshToken);
    if (isValidRefreshToken) {
      const user = await users.findOne({
        where: {
          email: isValidRefreshToken.email,
        },
      });

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const newAccessToken = generateToken(payload);

      return res.status(200).json({
        accessToken: newAccessToken,
      });
    } else {
      return res.status(401).json({
        code: 401,
        status: "UNAUTHORIZED",
      });
    }
  } else {
    return res.status(401).json({
      code: 401,
      status: "UNAUTHORIZED",
    });
  }
});

// endpoint for logout
app.post("/api/logout", async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({
    code: 200,
    status: "SUCCESS",
    data: "Logout success",
  });
});

try {
  if (env !== "test") {
    app.listen(PORT, () => {
      console.log("App running on port: ", PORT);
    });
  }
} catch (error) {
  console.log(error);
}

module.exports = app;
