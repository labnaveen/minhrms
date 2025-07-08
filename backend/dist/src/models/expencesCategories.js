"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const expensesCategoriesForms_1 = __importDefault(require("./expensesCategoriesForms"));
class expencesCategories extends sequelize_1.Model {
}
expencesCategories.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    category_name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    expense_category_form_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: expensesCategoriesForms_1.default, key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'expencesCategories',
    tableName: 'expenses_categories'
});
exports.default = expencesCategories;
