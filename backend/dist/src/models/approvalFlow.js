"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class ApprovalFlow extends sequelize_1.Model {
}
ApprovalFlow.init({
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
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    approval_flow_type_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'approval_flow_type', key: 'id' }
    },
    confirm_by_both_direct_undirect: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmation_by_all: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmation_by_all_direct: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmation_by_all_indirect: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'approval_flow',
    modelName: 'approval_flow'
});
exports.default = ApprovalFlow;
