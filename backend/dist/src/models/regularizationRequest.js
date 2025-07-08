"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class RegularizationRequest extends sequelize_1.Model {
}
RegularizationRequest.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    regularization_record_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'regularization_record', key: 'id' }
    },
    reporting_manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reporting_managers', key: 'id' }
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'regularisation_status', key: 'id' },
        defaultValue: 2
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'regularization_request',
    modelName: 'regularization_request'
});
exports.default = RegularizationRequest;
