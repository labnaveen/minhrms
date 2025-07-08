"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class Company extends sequelize_1.Model {
}
Company.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    company_name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    company_email: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    company_mobile: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    teamsize: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    industryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    domain: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    pan: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    gst: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    company_prefix: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'company',
    tableName: 'company'
});
exports.default = Company;
