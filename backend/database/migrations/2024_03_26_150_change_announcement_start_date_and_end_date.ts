//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("announcement", "start_date", {
        type: DataTypes.DATEONLY,
        allowNull: true,
    }),
    await queryInterface.changeColumn("announcement", "end_date", {
        type: DataTypes.DATEONLY,
        allowNull: true,
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("announcement", "start_date", {
      type: DataTypes.DATE,
      allowNull: true
    }),
    await queryInterface.changeColumn("announcement", "end_date", {
        type: DataTypes.DATE,
        allowNull: true
    })
  },
};


