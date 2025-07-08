//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.renameColumn("attendance_policy", "hours_half_day", "min_hours_for_half_day"),
    await queryInterface.changeColumn("attendance_policy", "min_hours_for_half_day", {
        type: DataTypes.FLOAT,
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.renameColumn("attendance_policy", "min_hours_for_half_day", "hours_half_day");
    await queryInterface.changeColumn("attendance_policy", "hours_half_day", {
      type: DataTypes.STRING
    })
  },
};


