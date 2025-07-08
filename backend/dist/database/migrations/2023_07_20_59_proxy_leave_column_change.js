"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("base_leave_configuration", "proxy_leave_by", "proxy_leave_application"),
            await queryInterface.changeColumn("base_leave_configuration", "proxy_leave_application", {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("attendance_policy", "proxy_leave_application", "proxy_leave_by");
        await queryInterface.changeColumn("attendance_policy", "proxy_leave_by", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        });
    },
};
