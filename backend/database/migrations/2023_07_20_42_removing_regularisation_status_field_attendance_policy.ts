//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.removeColumn("attendance_policy", "regularisation_status")
  },

  down: async({context: queryInterface}) => {
    await queryInterface.addColumn("attendance_policy", "regularisation_status", {
        type: DataTypes.STRING,
        allowNull: true
    })
  },
};


