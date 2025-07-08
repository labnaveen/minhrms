//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('regularization_record', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            in_time:{
                type: DataTypes.TIME,
                allowNull: false
            },
            out_time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            request_status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'attendance_status', key: 'id'}
            },
            reason: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                references: {model: 'approval_status', key: 'id'}
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
        await queryInterface.dropTable('regularization_record')
    }
}