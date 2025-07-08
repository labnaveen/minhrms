//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('asset', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            asset_code:{
                type: DataTypes.STRING,
                allowNull: false
            },
            asset_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            date_of_purchase:{
                type: DataTypes.DATE,
                allowNull: false
            },
            asset_cost:{
                type: DataTypes.STRING,
                allowNull: false
            },
            description:{
                type: DataTypes.STRING,
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
        await queryInterface.dropTable('asset')
    }
}