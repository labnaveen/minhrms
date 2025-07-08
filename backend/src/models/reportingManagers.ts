import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import User from "./user";
import ReportingRole from "./reportingRole";




class ReportingManagers extends Model{}

ReportingManagers.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: User, key: 'id'}
    },
    reporting_role_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: ReportingRole, key: 'id'}
    }

}, {
    sequelize,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    timestamps: true,
    tableName: 'reporting_managers',
    modelName: 'reporting_managers'
})


export default ReportingManagers