//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.createTable("day_type", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      name:{
        type:DataTypes.STRING,
        allowNull: false
      },
      created_at: { 
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    });
  },

  down: async({context: queryInterface}) => {
    await queryInterface.dropTable("day_type");
  },
};


