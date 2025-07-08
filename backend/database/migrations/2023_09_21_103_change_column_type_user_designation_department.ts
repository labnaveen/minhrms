//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("user", "designation", {
        type: DataTypes.INTEGER,
        allowNull: true,
    }),
    await queryInterface.changeColumn("user", "department", {
        type: DataTypes.INTEGER,
        allowNull: true,
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("user", "designation", {
      type: DataTypes.STRING,
      allowNull: true
    }),
    await queryInterface.changeColumn("user", "department", {
        type: DataTypes.STRING,
        allowNull: true
    })
  },
};


