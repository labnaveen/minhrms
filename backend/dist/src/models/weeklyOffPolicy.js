"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const sequelize_typescript_1 = require("sequelize-typescript");
class WeeklyOffPolicy extends sequelize_1.Model {
}
;
WeeklyOffPolicy.init({
    id: {
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'weekly_off_policy',
    modelName: 'weekly_off_policy'
});
exports.default = WeeklyOffPolicy;
