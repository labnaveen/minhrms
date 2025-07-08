//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.createTable("leave_balance", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      leave_type_id:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      leave_balance:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      is_deleted:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    });
  },

  down: async({context: queryInterface}) => {
    await queryInterface.dropTable("leave_balance");
  },
};


