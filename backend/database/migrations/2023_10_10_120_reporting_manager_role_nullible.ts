//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("user", "reporting_role_id", {
        type: DataTypes.INTEGER,
        allowNull: true,
    }),
    await queryInterface.changeColumn("user", "reporting_manager_id", {
        type: DataTypes.INTEGER,
        allowNull: true,
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("user", "reporting_role_id", {
      type: DataTypes.INTEGER,
      allowNull: false
    }),
    await queryInterface.changeColumn("user", "reporting_manager_id", {
        type: DataTypes.INTEGER,
        allowNull: false
    })
  },
};


