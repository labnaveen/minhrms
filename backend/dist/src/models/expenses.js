"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const models_1 = require("../models/");
const documents_1 = __importDefault(require("./documents"));
class expenses extends sequelize_1.Model {
}
expenses.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: models_1.User, key: 'id' }
    },
    category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: models_1.expencesCategories, key: 'id' }
    },
    status_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: models_1.expencesApprovalStatus, key: 'id' }
    },
    purpose_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: models_1.expencesPurpuse, key: 'id' }
    },
    transaction_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    billing_status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    bill_no: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    from_location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    to_location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    from_latitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    from_longitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    to_latitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    to_longitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    total_distance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    merchant_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    note: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    purpose_text: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    supporting_doc_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE
    },
    stay_from_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true
    },
    stay_to_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true
    },
    document_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: { model: documents_1.default, key: 'id' }
    },
    comment: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'expenses',
    tableName: 'expenses'
});
exports.default = expenses;
