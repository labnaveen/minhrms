"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class LeaveBalance extends sequelize_1.Model {
}
LeaveBalance.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' }
    },
    leave_type_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'leave_type', key: 'id' }
    },
    leave_balance: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    total_leaves: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'leave_balance',
    paranoid: true,
    deletedAt: 'deleted_at'
});
exports.default = LeaveBalance;
