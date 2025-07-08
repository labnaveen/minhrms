"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class AnnouncementEmployee extends sequelize_1.Model {
}
AnnouncementEmployee.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    announcement_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'announcement', key: 'id' }
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'announcement_employee',
    modelName: 'announcement_employee'
});
exports.default = AnnouncementEmployee;
