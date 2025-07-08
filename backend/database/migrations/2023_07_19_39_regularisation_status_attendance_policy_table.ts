//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.createTable("regularisation_status_attendance_policy", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      attendance_policy_id:{
        type:DataTypes.INTEGER,
        allowNull: false
      },
      regularisation_status_id: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable("regularisation_status_attendance_policy");
  },
};


