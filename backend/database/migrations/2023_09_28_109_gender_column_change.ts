//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.renameColumn("user", "employee_gender", "employee_gender_id"),
    await queryInterface.changeColumn("user", "employee_gender_id", {
        type: DataTypes.INTEGER,
        allowNull: false,
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.renameColumn("user", "employee_gender_id", "employee_gender"),
    await queryInterface.changeColumn("user", "employee_gender_id", {
      type: DataTypes.STRING,
      allowNull: true
    })
  },
};


