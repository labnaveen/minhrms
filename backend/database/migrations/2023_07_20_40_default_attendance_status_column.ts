//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.addColumn("attendance_policy", "default_attendance_status", {
      type:DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },

  down: async({context: queryInterface}) => {
    await queryInterface.removeColumn("attendance_policy", "default_attendance_status");
  },
};


