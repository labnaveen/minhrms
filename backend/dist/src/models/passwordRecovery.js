"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const moment_1 = __importDefault(require("moment"));
class PasswordRecovery extends sequelize_1.Model {
}
PasswordRecovery.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    otp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    sent_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    expires_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    isExpired: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            if (!this.get('expires_at')) {
                return true;
            }
            //@ts-ignore
            if ((0, moment_1.default)().toDate() > (0, moment_1.default)(this.get('expires_at')).toDate()) {
                return true;
            }
            return false;
        }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'password_recovery',
    modelName: 'password_recovery'
});
exports.default = PasswordRecovery;
