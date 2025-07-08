"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('profile_change_record', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'user', key: 'id' }
            },
            section: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            previous: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false
            },
            change: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false
            },
            status: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'approval_status', key: 'id' },
                defaultValue: 1
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
        await queryInterface.dropTable('profile_change_record');
    }
};
