"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class ReportingRole extends sequelize_1.Model {
}
;
ReportingRole.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        unique: true
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    tableName: 'reporting_role',
    modelName: 'reporting_role',
    timestamps: true
});
exports.default = ReportingRole;
