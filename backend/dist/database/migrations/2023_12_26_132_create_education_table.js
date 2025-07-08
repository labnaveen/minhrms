"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('education', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                reference: { model: 'user', key: 'id' }
            },
            institution_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            degree_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'education_type', key: 'id' }
            },
            course_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            field_of_study: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            year_of_completion: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            percentage: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE
            }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('education');
    }
};
