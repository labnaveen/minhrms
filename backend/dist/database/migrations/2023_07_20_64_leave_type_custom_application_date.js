"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.addColumn('leave_type', 'custom_leave_application_date', {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        });
    },
    down: async ({ context: queryInterface }) => {
        // logic for reverting the changes
        await queryInterface.removeColumn('leave_type', 'custom_leave_application_date');
    }
};
