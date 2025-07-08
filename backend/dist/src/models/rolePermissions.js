"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const permissions_1 = __importDefault(require("./permissions"));
const roles_1 = __importDefault(require("./roles"));
class RolePermissions extends sequelize_1.Model {
}
;
RolePermissions.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    permissions_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: permissions_1.default, key: 'id' }
    },
    roles_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: roles_1.default, key: 'id' }
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'permissions_roles',
    modelName: 'permissions_roles'
});
exports.default = RolePermissions;
