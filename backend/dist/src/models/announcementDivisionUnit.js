"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class AnnouncementDivisionUnit extends sequelize_1.Model {
}
AnnouncementDivisionUnit.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    announcement_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'announcement', key: 'id' }
    },
    division_unit_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'division_units', key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'announcement_division_unit',
    modelName: 'announcement_division_unit'
});
exports.default = AnnouncementDivisionUnit;
