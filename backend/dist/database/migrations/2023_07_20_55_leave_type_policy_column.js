"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("leave_type_policy", "accrual_from_custom_date", {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn("leave_type_policy", "accrual_from_custom_date");
    },
};
