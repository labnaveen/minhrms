"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("reporting_managers", "deleted_at", {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("reporting_managers", "deleted_at");
    }
};
