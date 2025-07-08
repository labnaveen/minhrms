//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('regularisation_status', {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            name:{
                type: DataTypes.TEXT,
                allowNull: false
            },
            is_deleted:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            created_at:{
                type: DataTypes.DATE,
                allowNull: false
            },
            updated_at:{
                type: DataTypes.DATE,
                allowNull: false
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('regularisation_status')
    }
}