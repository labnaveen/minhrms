"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class Asset extends sequelize_1.Model {
}
;
Asset.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    asset_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    asset_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date_of_purchase: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    asset_cost: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    is_assigned: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'asset',
    modelName: 'asset',
    paranoid: true,
    deletedAt: 'deleted_at'
});
exports.default = Asset;
