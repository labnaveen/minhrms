"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const user_1 = __importDefault(require("./user"));
const asset_1 = __importDefault(require("./asset"));
class AssignedAsset extends sequelize_1.Model {
}
;
AssignedAsset.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: user_1.default, key: 'id' }
    },
    asset_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: asset_1.default, key: 'id' }
    },
    date_of_issue: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    date_of_return: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    deleted_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'assigned_asset',
    tableName: 'assigned_asset'
});
exports.default = AssignedAsset;
