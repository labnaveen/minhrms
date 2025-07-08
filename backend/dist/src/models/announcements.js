"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class Announcement extends sequelize_1.Model {
}
;
Announcement.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    suspendable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    group_specific: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    start_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true
    },
    end_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true
    },
    // acceptable_announcement: {
    //     type: DataTypes.BOOLEAN,
    //     allowNull: false,
    //     defaultValue: false
    // },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    paranoid: true,
    tableName: 'announcement',
    modelName: 'announcement',
    deletedAt: 'deleted_at'
});
exports.default = Announcement;
