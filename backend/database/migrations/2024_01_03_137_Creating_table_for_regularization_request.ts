//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('regularization_request', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            regularization_record_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'regularization_record', key: 'id'}
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
        await queryInterface.dropTable('regularization_request')
    }
}