//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('holiday_calendar_association', {
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
            holiday_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'holiday_database', key: 'id'}
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
        await queryInterface.dropTable('holiday_calendar_association')
    }
}