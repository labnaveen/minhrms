"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("user", "reporting_role_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'reporting_role', key: 'id' }
        }),
            await queryInterface.addColumn("user", "reporting_manager_id", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'reporting_managers', key: 'id' }
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("user", "reporting_role_id");
        await queryInterface.deleteColumn("user", "reporting_manager_id");
    }
};
