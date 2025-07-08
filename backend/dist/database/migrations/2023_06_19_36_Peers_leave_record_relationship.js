"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable("peers_leave_record", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true
            },
            leave_record_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            peer_user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
            },
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable("peers_leave_record");
    },
};
