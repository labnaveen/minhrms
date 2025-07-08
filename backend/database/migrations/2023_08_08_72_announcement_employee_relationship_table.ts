//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('announcement_employee', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            announcement_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'announcement', key: 'id'}
            },
            employee_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{model: 'user', key: 'id'}
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('announcement_employee')
    }
}