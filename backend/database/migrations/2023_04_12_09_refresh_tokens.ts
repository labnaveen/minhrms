//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.createTable('refresh', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER,
        },
        refresh_token:{
            type: DataTypes.TEXT
        },
        created_at:{
            type: DataTypes.DATE
        },
        updated_at:{
            type: DataTypes.DATE
        },
      })

    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.dropTable('refresh')
    }
}