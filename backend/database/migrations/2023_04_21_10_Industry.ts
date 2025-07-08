//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.createTable('industry', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        name:{
            type: DataTypes.TEXT,
        },
        is_deleted:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
      await queryInterface.dropTable('industry')
    }
}