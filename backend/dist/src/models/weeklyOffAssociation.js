"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class WeeklyOffAssociation extends sequelize_1.Model {
}
WeeklyOffAssociation.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    weekly_off_policy_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'weekly_off_policy', key: 'id' }
    },
    week_name: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'week', key: 'id' }
    },
    week_number: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'weekly_off_association',
    modelName: 'weekly_off_association'
});
exports.default = WeeklyOffAssociation;
