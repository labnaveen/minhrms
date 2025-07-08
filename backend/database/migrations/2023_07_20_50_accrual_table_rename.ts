//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.renameTable("accural_type", "accrual_type")
  },

  down: async({context: queryInterface}) => {
    await queryInterface.renameColumn("accrual_type", "accural_type")
  },
};


