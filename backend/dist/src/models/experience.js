"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class Experience extends sequelize_1.Model {
}
Experience.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "user", key: 'id' }
    },
    company_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    designation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    employment_type_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'employment_type', key: 'id' }
    },
    start_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    tableName: 'experience',
    modelName: 'experience'
});
exports.default = Experience;
