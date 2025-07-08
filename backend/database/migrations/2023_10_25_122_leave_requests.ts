//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('leave_request', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            leave_record_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'leave_record', key: 'id'}
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{model: 'user', key: 'id'}
            },
            status:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{model:'approval_status', key: 'id'},
                defaultValue: 1
            },
            priority:{
                type: DataTypes.INTEGER,
                allowNull: false,
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
        await queryInterface.dropTable('leave_request')
    }
}