//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("notification", "image", {
        type: DataTypes.STRING,
        allowNull: true
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("notification", "image", {
      type: DataTypes.STRING,
      allowNull: false
    })
  },
};


