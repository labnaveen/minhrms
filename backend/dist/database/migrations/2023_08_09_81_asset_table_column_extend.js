"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('asset', 'user_id', {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'user', key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('asset', 'user_id');
    }
};
