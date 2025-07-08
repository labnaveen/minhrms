"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("master_policy", "profile_change_workflow", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'approval_flow', key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("master_policy", "profile_change_workflow");
    }
};
