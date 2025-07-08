import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";





class ReportingRole extends Model{};


ReportingRole.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    priority:{
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    }

}, {
    sequelize,
    underscored: true,
    tableName: 'reporting_role',
    modelName: 'reporting_role',
    timestamps: true
})


export default ReportingRole