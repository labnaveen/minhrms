//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.removeColumn("leave_type", "base_leave_configuration_id")
  },

  down: async({context: queryInterface}) => {
    await queryInterface.addColumn("leave_type", "base_leave_configuration_id", {
        type: DataTypes.STRING,
        allowNull: true
    })
  },
};


