//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('expenses_categories', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            category_name:{
                type: DataTypes.STRING,
                allowNull: false
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('expenses_categories')
    }
}