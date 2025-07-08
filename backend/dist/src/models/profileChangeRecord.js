"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class ProfileChangeRecord extends sequelize_1.Model {
}
ProfileChangeRecord.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' }
    },
    section: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    previous: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false
    },
    change: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'approval_status', key: 'id' },
        defaultValue: 1
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'profile_change_record',
    modelName: 'profile_change_record'
});
exports.default = ProfileChangeRecord;
