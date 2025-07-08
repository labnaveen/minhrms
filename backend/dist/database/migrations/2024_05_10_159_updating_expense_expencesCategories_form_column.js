"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("expenses_categories", "expense_category_form_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'expenses_categories_forms', key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("expenses_categories", "expense_category_form_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        });
    },
};
