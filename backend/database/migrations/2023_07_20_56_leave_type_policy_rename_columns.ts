//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.renameColumn("leave_type_policy", "accrural_frequency", "accrual_frequency");
    await queryInterface.renameColumn("leave_type_policy", "accrural_type", "accrual_type");
    await queryInterface.renameColumn("leave_type_policy", "accrural_from", "accrual_from");
  },

  down: async({context: queryInterface}) => {
    await queryInterface.renameColumn("leave_type_policy", "accrual_frequency", "accrural_frequency");
    await queryInterface.renameColumn("leave_type_policy", "accrual_type", "accrural_type");
    await queryInterface.renameColumn("leave_type_policy", "accrual_from", "accrural_from");
  },
};


