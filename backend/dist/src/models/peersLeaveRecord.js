"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const leaveRecord_1 = __importDefault(require("./leaveRecord"));
const user_1 = __importDefault(require("./user"));
class PeersLeaveRecord extends sequelize_1.Model {
}
PeersLeaveRecord.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    leave_record_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: leaveRecord_1.default, key: 'id' }
    },
    peer_user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: user_1.default, key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'peers_leave_record',
    tableName: 'peers_leave_record'
});
exports.default = PeersLeaveRecord;
