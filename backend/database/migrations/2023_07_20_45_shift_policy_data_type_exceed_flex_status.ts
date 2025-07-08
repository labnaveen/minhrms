//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("shift_policy", "status_flexi_exceeded", {
        type: DataTypes.INTEGER,
        allowNull: true
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("shift_policy", "status_flexi_exceeded", {
      type: DataTypes.STRING
    })
  },
};


