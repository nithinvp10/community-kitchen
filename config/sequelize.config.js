const { Sequelize } = require("sequelize");

const sequelizeConfig = new Sequelize({
  host: "localhost",
  database: "ck",
  username: "postgres",
  password: "scam",
  dialect: "postgres",
  port: 5432,
});

module.exports = sequelizeConfig;
