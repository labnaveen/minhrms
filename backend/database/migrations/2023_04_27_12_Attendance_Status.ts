//@ts-nocheck
import { DataTypes } from "sequelize"


module.exports = {
    up: async ({context: queryInterface}) => {
        await queryInterface.createTable('attendance_status', {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            name:{
                type: DataTypes.STRING,
                unique: true,
            },
            is_deleted:{
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            created_at:{
                type: DataTypes.DATE,
            },
            updated_at:{
                type: DataTypes.DATE
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('display_rules')
    }
}