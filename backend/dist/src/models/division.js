"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class Division extends sequelize_1.Model {
}
;
Division.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    division_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
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
    tableName: 'division',
    modelName: 'division'
});
exports.default = Division;
