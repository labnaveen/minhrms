"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('announcement', 'created_at', {
            type: sequelize_1.DataTypes.DATE,
        });
        await queryInterface.addColumn('announcement', 'updated_at', {
            type: sequelize_1.DataTypes.DATE
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('announcement', 'created_at');
        await queryInterface.removeColumn('announcement', 'updated_at');
    }
};
