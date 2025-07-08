"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class expencesApprovalStatus extends sequelize_1.Model {
}
expencesApprovalStatus.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    border_hex_color: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    button_hex_color: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'expencesApprovalStatus',
    tableName: 'expenses_approval_status'
});
exports.default = expencesApprovalStatus;
