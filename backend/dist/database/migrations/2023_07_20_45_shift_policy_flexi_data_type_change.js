"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("shift_policy", "exceeded_flexi_time_limit", "status_punch_in_time_exceeded"),
            await queryInterface.changeColumn("shift_policy", "status_punch_in_time_exceeded", {
                type: sequelize_1.DataTypes.INTEGER
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("status_punch_in_time_exceeded", "exceeded_flexi_time_limit");
    },
};
