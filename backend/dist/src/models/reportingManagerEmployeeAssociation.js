"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = __importDefault(require("./user"));
const reportingRole_1 = __importDefault(require("./reportingRole"));
const reportingManagers_1 = __importDefault(require("./reportingManagers"));
class ReportingManagerEmployeeAssociation extends sequelize_1.Model {
}
;
ReportingManagerEmployeeAssociation.init({
    id: {
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    user_id: {
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: { model: user_1.default, key: 'id' }
    },
    reporting_role_id: {
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: { model: reportingRole_1.default, key: 'id' }
    },
    reporting_manager_id: {
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: { model: reportingManagers_1.default, key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'reporting_manager_employee_association',
    modelName: 'reporting_manager_employee_association'
});
exports.default = ReportingManagerEmployeeAssociation;
