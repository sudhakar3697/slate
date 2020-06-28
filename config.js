require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE: process.env.DATABASE,
  USER_NAME: process.env.USER_NAME,
  PASSWORD: process.env.PASSWORD,
};
