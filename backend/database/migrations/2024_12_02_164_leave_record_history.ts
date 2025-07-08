//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('leave_request_history', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                unique: true,
                autoIncrement: true
            },
            leave_record_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'leave_record',
                    key: 'id'
                }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id'
                }
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false,   
            },
            status_before: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'approval_status',
                    key: 'id'
                }
            },
            status_after: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'approval_status',
                    key: 'id'
                }
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
        await queryInterface.dropTable('leave_request_history')
    }
}