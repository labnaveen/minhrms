"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class ExpenseRequest extends sequelize_1.Model {
}
;
ExpenseRequest.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        unique: true
    },
    expense_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'expenses', key: 'id' }
    },
    reporting_manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reporting_managers', key: 'id' }
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'approval_status', key: 'id' },
        defaultValue: 1
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'expense_request',
    modelName: 'expense_request'
});
exports.default = ExpenseRequest;
