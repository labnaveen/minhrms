//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.createTable("leave_record", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      leave_type_id:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      day_type_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      end_date:{
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      reason:{
        type: DataTypes.STRING,
        allowNull: true
      },
      document:{
        type: DataTypes.STRING,
        allowNull: true
      },
      contact_number:{
        type: DataTypes.STRING,
        allowNull: true
      },
      status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
    await queryInterface.dropTable("leave_record");
  },
};


