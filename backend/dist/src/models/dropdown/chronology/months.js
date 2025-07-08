"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../../utilities/db");
const sequelize_1 = require("sequelize");
class Months extends sequelize_1.Model {
}
Months.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'months',
    modelName: 'months'
});
exports.default = Months;
