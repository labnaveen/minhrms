//@ts-nocheck
import { DataTypes } from "sequelize";
import { LeaveType } from "../../src/models";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.addColumn("base_leave_configuration", "custom_month", {
        type: DataTypes.INTEGER,
        allowNull: true,
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.removeColumn("base_leave_configuration", "custom_month")
  },
};


