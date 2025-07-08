//@ts-nocheck

import { DataTypes } from "sequelize";

module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('announcement_division_unit', {
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
            division_unit_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'division_units', key: 'id'}
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
        await queryInterface.dropTable('announcement_division_unit')
    }
}