"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class Education extends sequelize_1.Model {
}
Education.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' }
    },
    institution_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    degree_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'education_type', key: 'id' }
    },
    course_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    field_of_study: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    year_of_completion: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    percentage: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'education',
    modelName: 'education'
});
exports.default = Education;
