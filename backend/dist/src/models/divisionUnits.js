"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class DivisionUnits extends sequelize_1.Model {
}
;
DivisionUnits.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    unit_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    division_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: 'division', key: 'id' }
    },
    system_generated: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'division_units',
    modelName: 'division_units'
});
exports.default = DivisionUnits;
