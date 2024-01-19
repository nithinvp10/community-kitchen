const {DataTypes}=require('sequelize');
const sequelizeConfig=require('../../config/sequelize.config');

const loginModel = sequelizeConfig.define("adminlogin", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  
  
  module.exports=loginModel