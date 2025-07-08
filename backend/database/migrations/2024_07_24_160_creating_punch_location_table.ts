//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('punch_location', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            attendance_log_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'attendance', key: 'id' }
            },
            punch_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            latitude: {
                type: DataTypes.STRING,
                allowNull: false
            },
            longitude: {
                type: DataTypes.STRING,
                allowNull: false
            },
            location: {
                type: DataTypes.JSON,
                allowNull: true
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
        await queryInterface.dropTable('punch_location')
    }
}