//@ts-nocheck
import { DataTypes } from "sequelize";
import { LeaveType } from "../../src/models";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.addColumn("leave_type_policy", "leave_type_id", {
        type: DataTypes.INTEGER,
        allowNull: false,
        reference: {model: LeaveType, key: 'id'}
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.removeColumn("leave_type_policy", "leave_type_id")
  },
};


