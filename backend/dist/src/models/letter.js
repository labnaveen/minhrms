"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const documents_1 = __importDefault(require("./documents"));
const user_1 = __importDefault(require("./user"));
const letterStatus_1 = __importDefault(require("./letterStatus"));
class Letter extends sequelize_1.Model {
}
;
Letter.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: user_1.default, key: 'id' }
    },
    document_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: documents_1.default, key: 'id' }
    },
    letter_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: letterStatus_1.default, key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'letter',
    modelName: 'letter'
});
exports.default = Letter;
