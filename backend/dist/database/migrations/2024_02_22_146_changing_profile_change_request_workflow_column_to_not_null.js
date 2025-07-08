"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("master_policy", "profile_change_workflow", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'approval_flow', key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("master_policy", "profile_change_workflow");
    }
};
