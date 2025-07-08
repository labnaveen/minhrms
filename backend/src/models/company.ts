import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utilities/db";


class Company extends Model{}

Company.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    company_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    company_email:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    company_mobile:{
        type: DataTypes.NUMBER,
        allowNull: false
    },
    teamsize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    industryId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    domain:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    pan:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    gst: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    company_prefix:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
},{
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'company',
    tableName: 'company'
})

export default Company;