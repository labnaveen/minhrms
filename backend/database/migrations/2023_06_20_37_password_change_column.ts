//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.addColumn("user", "password_changed", {
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async({context: queryInterface}) => {
    await queryInterface.removeColumn("user", "password_changed");
  },
};


