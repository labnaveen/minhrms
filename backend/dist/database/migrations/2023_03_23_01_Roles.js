"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.createTable('roles', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            alias: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE
            }
        });
        await queryInterface.bulkInsert('roles', [{
                name: 'HR',
                alias: 'HR',
                description: 'This role is for the main super HR',
                status: 1,
                created_at: '2023-03-23 19:53:50',
                updated_at: '2023-03-23 19:53:50'
            }], {});
    },
    down: async ({ context: queryInterface }) => {
        // logic for reverting the changes
        await queryInterface.dropTable('roles');
    }
};
