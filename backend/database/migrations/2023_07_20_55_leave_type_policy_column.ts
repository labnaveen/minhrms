//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.addColumn("leave_type_policy", "accrual_from_custom_date", {
        type: DataTypes.DATE,
        allowNull: true
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.removeColumn("leave_type_policy", "accrual_from_custom_date")
  },
};


