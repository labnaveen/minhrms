"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("expenses", "document_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'documents', key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("expenses", "document_id");
    }
};
