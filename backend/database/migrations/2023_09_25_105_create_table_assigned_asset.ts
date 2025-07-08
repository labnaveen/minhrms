//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('assigned_asset', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'user', key: 'id'}
            },
            asset_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'asset', key: 'id'}
            },
            date_of_issue: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            date_of_return: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            description:{
                type: DataTypes.STRING,
                allowNull: true
            },
            deleted_at:{
                type: DataTypes.DATE,
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
        await queryInterface.dropTable('assigned_asset')
    }
}