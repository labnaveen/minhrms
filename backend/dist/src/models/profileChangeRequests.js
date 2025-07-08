"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class ProfileChangeRequests extends sequelize_1.Model {
}
;
ProfileChangeRequests.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    profile_change_record_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'profile_change_record', key: 'id' }
    },
    reporting_manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reporting_managers', key: 'id' }
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'approval_status', key: 'id' },
        defaultValue: 1
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'profile_change_request',
    modelName: 'profile_change_request'
});
exports.default = ProfileChangeRequests;
