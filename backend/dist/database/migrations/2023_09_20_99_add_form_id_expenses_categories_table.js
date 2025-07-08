"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("expenses_categories", "expense_category_form_id", {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: false,
            allowNull: false
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("expenses_categories", "expense_category_form_id");
    }
};
