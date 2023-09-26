const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
// console.log(REFRESH_TOKEN_SECRET_KEY);

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (email) => {
  //   console.log(email);
  try {
    return jwt.sign(email, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: "1h",
    });
  } catch (error) {
    console.log(error);
  }
};

const compareToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

const compareRefreshToken = (refreshTokenFromCookies) => {
  try {
    return jwt.verify(refreshTokenFromCookies, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: "1d",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateToken,
  compareToken,
  generateRefreshToken,
  compareRefreshToken,
};
