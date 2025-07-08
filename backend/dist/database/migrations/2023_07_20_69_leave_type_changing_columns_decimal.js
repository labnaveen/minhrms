"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("leave_type", "prorated_rounding_factor", {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true
        });
        await queryInterface.changeColumn("leave_type", "max_leaves_for_encashment", {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true
        });
        await queryInterface.changeColumn("leave_type", "carry_forward_rounding_factor", {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("leave_type", "proxy_leave_by", {
            type: sequelize_1.DataTypes.DECIMAL,
            allowNull: true
        });
        await queryInterface.changeColumn("leave_type", "max_leaves_for_encashment", {
            type: sequelize_1.DataTypes.DECIMAL,
            allowNull: true
        });
        await queryInterface.changeColumn("leave_type", "carry_forward_rounding_factor", {
            type: sequelize_1.DataTypes.DECIMAL,
            allowNull: true
        });
    },
};
