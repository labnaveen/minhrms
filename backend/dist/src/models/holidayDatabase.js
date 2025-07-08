"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class HolidayDatabase extends sequelize_1.Model {
}
;
HolidayDatabase.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    custom_holiday: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'holiday_database',
    modelName: 'holiday_database'
});
exports.default = HolidayDatabase;
