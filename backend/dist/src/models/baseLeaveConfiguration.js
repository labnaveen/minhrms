"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class BaseLeaveConfiguration extends sequelize_1.Model {
}
BaseLeaveConfiguration.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        allowNull: false
    },
    policy_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    policy_description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    leave_calendar_from: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    custom_month: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    proxy_leave_application: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true
    },
    leave_request_status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    leave_balance_status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    contact_number_allowed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    contact_number_mandatory: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    reason_for_leave: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    reason_for_leave_mandatory: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    notify_peer: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    notify_peer_mandatory: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    leave_rejection_reason: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'base_leave_configuration',
    tableName: 'base_leave_configuration'
});
exports.default = BaseLeaveConfiguration;
