const { DataTypes } = require("sequelize");
const sequelizeConfig = require("../../config/sequelize.config");

const feedbackModel = sequelizeConfig.define("feedback", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = feedbackModel;
