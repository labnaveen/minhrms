"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('user', 'master_policy_id', {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'master_policy', key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('master_policy', 'master_policy_id');
    }
};
