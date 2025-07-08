//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.createTable("peers_leave_record", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      leave_record_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      peer_user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable("peers_leave_record");
  },
};


