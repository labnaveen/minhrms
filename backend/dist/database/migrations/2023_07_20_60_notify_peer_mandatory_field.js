"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("base_leave_configuration", "notify_peer_mandatory", {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false
        }),
            await queryInterface.changeColumn("base_leave_configuration", "proxy_leave_application", {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn("base_leave_configuration", "notify_peer_mandatory");
        await queryInterface.changeColumn("base_leave_configuration", "proxy_leave_application", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        });
    },
};
