"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("leave_record", "half_day_type_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'half_day_type', key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("leave_record", "half_day_type_id");
    }
};
