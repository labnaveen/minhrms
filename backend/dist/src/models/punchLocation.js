"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const attendance_1 = __importDefault(require("./attendance"));
class PunchLocation extends sequelize_1.Model {
}
;
PunchLocation.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    attendance_log_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: attendance_1.default, key: 'id' }
    },
    punch_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    latitude: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    longitude: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'punch_location',
    modelName: 'punch_location'
});
exports.default = PunchLocation;
