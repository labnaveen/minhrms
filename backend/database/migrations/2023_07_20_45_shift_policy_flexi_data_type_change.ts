//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.renameColumn("shift_policy", "exceeded_flexi_time_limit", "status_punch_in_time_exceeded"),
    await queryInterface.changeColumn("shift_policy", "status_punch_in_time_exceeded", {
        type: DataTypes.INTEGER
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.renameColumn("status_punch_in_time_exceeded", "exceeded_flexi_time_limit")
  },
};


