//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.addColumn("attendance_policy", "mobile_app_restriction", {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }),
    await queryInterface.addColumn("attendance_policy", "number_of_devices_allowed", {
      type: DataTypes.STRING,
      allowNull: true
  })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.deleteColumn("attendance_policy", "mobile_app_restriction");
    await queryInterface.deleteColumn("attendance_policy", "number_of_devices_allowed");
  },
};


