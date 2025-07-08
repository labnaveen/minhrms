"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("leave_record", "reject_reason", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn("leave_record", "last_action_by", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'user', key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("leave_record", "reject_reason");
        await queryInterface.deleteColumn("leave_record", "last_action_by");
    }
};
