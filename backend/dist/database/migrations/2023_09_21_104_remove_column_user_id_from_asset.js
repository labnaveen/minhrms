"use strict";
//@ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn("asset", "user_id");
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("asset", "user_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'user', key: 'id' }
        });
    }
};
