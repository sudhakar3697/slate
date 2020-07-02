require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE: process.env.DATABASE,
  USER_NAME: process.env.USER_NAME,
  PASSWORD: process.env.PASSWORD,
  SECRET_KEY: process.env.SECRET_KEY,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10),
  CONFIRMATION_MAIL: process.env.CONFIRMATION_MAIL,
  CONFIRMATION_MAIL_PASSWORD: process.env.CONFIRMATION_MAIL_PASSWORD,
  HEROKU_PG_DATABASE_URL: process.env.DATABASE_URL,
  BASE_URL: process.env.BASE_URL,
};
