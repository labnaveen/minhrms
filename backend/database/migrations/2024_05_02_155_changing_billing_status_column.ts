//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("expenses", "billing_status", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("expenses", "billing_status", {
      type: DataTypes.STRING,
      allowNull: false
    })
  },
};


