const {DataTypes}=require('sequelize');
const sequelizeConfig=require('../../config/sequelize.config');

const productModel=sequelizeConfig.define('product',{
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name:{
          type: DataTypes.STRING,
          allowNull: false, 
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      ingredients: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image:{
        type: DataTypes.STRING,
        allowNull: false, 
      }
});

module.exports=productModel;