//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("shift_policy", "number_of_days_grace_allowed", {
        type: DataTypes.INTEGER,
        allowNull: true,
    }),
    await queryInterface.changeColumn("shift_policy", "grace_duration_allowed", {
        type: DataTypes.INTEGER,
        allowNull: true,
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("shift_policy", "number_of_days_grace_allowed", {
      type: DataTypes.STRING,
      allowNull: true
    }),
    await queryInterface.changeColumn("shift_policy", "grace_duration_allowed", {
        type: DataTypes.STRING,
        allowNull: true
    })
  },
};


