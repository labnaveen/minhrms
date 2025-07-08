//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.removeColumn("user", "designation"),
    await queryInterface.removeColumn("user", "department")
  },

  down: async({context: queryInterface}) => {
    await queryInterface.addColumn("user", "designation", {
      type: DataTypes.INTEGER,
      allowNull: true
    }),
    await queryInterface.addColumn("user", "department", {
        type: DataTypes.INTEGER,
        allowNull: true
    })
  },
};


