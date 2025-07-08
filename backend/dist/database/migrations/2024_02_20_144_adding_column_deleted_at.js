"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("asset", "deleted_at", {
            type: sequelize_1.DataTypes.DATE
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("asset", "deleted_at");
    }
};
