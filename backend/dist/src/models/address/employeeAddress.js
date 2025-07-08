"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../utilities/db");
class EmployeeAddress extends sequelize_1.Model {
}
EmployeeAddress.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    employee_present_address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    employee_present_pincode: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    employee_present_city: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    employee_present_state: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    employee_present_country_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    employee_present_mobile: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    employee_permanent_address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    employee_permanent_pincode: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    employee_permanent_city: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    employee_permanent_state: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    employee_permanent_country_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    employee_permanent_mobile: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: 'user', key: 'id' }
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'employee_address',
    tableName: 'employee_address'
});
exports.default = EmployeeAddress;
