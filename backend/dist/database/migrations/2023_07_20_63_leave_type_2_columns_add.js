"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.addColumn('leave_type', 'leave_application_after', {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        });
        await queryInterface.addColumn('leave_type', 'inbetween_holiday_sandwhich_rule', {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        });
    },
    down: async ({ context: queryInterface }) => {
        // logic for reverting the changes
        await queryInterface.removeColumn('leave_type', 'leave_application_after');
        await queryInterface.removeColumn('leave_type', 'inbetween_holiday_sandwhich_rule');
    }
};
