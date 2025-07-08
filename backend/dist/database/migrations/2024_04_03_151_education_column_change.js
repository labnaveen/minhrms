"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("education", "percentage", {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("education", "percentage", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        });
    }
};
