//@ts-nocheck
import { DataTypes } from "sequelize"

module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.createTable('roles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        alias: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        status:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        is_deleted:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_system_generated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at:{
            type: DataTypes.DATE
        },  
        updated_at:{
            type: DataTypes.DATE
        }
      })
      await queryInterface.bulkInsert('roles', [{
        name: 'Admin',
        alias: 'admin',
        description: 'This role is for the main Administrator',
        status: 1,
        is_system_generated: true,
        created_at: '2023-03-23 19:53:50',
        updated_at: '2023-03-23 19:53:50'
      }], {});
    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.dropTable('roles')
    }
}