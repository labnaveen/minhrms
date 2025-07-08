"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("attendance", "flexi_used", {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }),
            await queryInterface.addColumn("attendance", "grace_used", {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }),
            await queryInterface.addColumn("attendance", "flexi_counter", {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: true
            }),
            await queryInterface.addColumn("attendance", "grace_counter", {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: true
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("attendance", "flexi_used");
        await queryInterface.deleteColumn("attendance", "grace_used");
        await queryInterface.deleteColumn("attendance", "flexi_counter");
        await queryInterface.deleteColumn("attendance", "grace_counter");
    }
};
