//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('custom_holiday', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            holiday_calendar_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'holiday_calendar', key: 'id'}
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            date:{
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            created_at:{
                type: DataTypes.DATE
            },
            updated_at:{
                type: DataTypes.DATE
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('custom_holiday')
    }
}