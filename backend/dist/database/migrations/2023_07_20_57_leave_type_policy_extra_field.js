"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
const models_1 = require("../../src/models");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("leave_type_policy", "leave_type_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            reference: { model: models_1.LeaveType, key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn("leave_type_policy", "leave_type_id");
    },
};
