"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class LeaveType extends sequelize_1.Model {
}
LeaveType.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    leave_type_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    negative_balance: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    max_leave_allowed_in_negative_balance: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    max_days_per_leave: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    max_days_per_month: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    allow_half_days: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    leave_application_after: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'accrual_from', key: 'id' }
    },
    application_on_holidays: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    restriction_for_application: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    limit_back_dated_application: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    notice_for_application: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    auto_approval: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    auto_action_after: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    auto_approval_action: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    supporting_document_mandatory: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    prorated_accrual_first_month: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    prorated_rounding: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    prorated_rounding_factor: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    encashment_yearly: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    max_leaves_for_encashment: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    carry_forward_yearly: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    carry_forward_rounding: {
        type: sequelize_1.DataTypes.INTEGER
    },
    carry_forward_rounding_factor: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    intra_cycle_carry_forward: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    prefix_postfix_weekly_off_sandwhich_rule: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    prefix_postfix_holiday_sandwhich_rule: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    inbetween_weekly_off_sandwhich_rule: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    inbetween_holiday_sandwhich_rule: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    custom_leave_application_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'leave_type',
    modelName: 'leave_type'
});
exports.default = LeaveType;
