"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('approval_flow', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            approval_flow_type_id: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: 'approval_flow_type', key: 'id' }
            },
            confirm_by_both_direct_undirect: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            confirmation_by_all: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            confirmation_by_all_direct: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            confirmation_by_all_indirect: {
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
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('approval_flow');
    }
};
