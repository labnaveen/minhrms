"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const user_1 = __importDefault(require("./user"));
const reportingRole_1 = __importDefault(require("./reportingRole"));
class ReportingManagers extends sequelize_1.Model {
}
ReportingManagers.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: user_1.default, key: 'id' }
    },
    reporting_role_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: reportingRole_1.default, key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    timestamps: true,
    tableName: 'reporting_managers',
    modelName: 'reporting_managers'
});
exports.default = ReportingManagers;
