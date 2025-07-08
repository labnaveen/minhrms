"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utilities/db");
const sequelize_1 = require("sequelize");
class ShiftType extends sequelize_1.Model {
}
;
ShiftType.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'shift_type',
    modelName: 'shift_type'
});
