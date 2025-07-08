"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("regularization_record", "date", {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("regularization_record", "date");
    }
};
