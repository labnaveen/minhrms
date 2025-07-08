"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../../utilities/db");
class CompanyAddress extends sequelize_1.Model {
}
CompanyAddress.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    company_present_address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    company_present_pincode: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    company_present_city: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    company_present_state: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    company_present_country_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    company_present_mobile: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    company_permanent_address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    company_permanent_pincode: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    company_permanent_city: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    company_permanent_state: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    company_permanent_country_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    company_permanent_mobile: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    company_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: 'company', key: 'id' }
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'company_address',
    tableName: 'company_address',
    freezeTableName: true
});
exports.default = CompanyAddress;
