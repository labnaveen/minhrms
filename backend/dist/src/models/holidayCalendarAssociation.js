"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class HolidayCalendarAssociation extends sequelize_1.Model {
}
;
HolidayCalendarAssociation.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
    },
    holiday_calendar_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'holiday_calendar', key: 'id' }
    },
    holiday_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'holiday_database', key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'holiday_calendar_association',
    tableName: 'holiday_calendar_association'
});
exports.default = HolidayCalendarAssociation;
