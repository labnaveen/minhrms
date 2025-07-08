import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import User from "./user";
import Asset from "./asset";




class AssignedAsset extends Model{};


AssignedAsset.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: User, key: 'id'}
    },
    asset_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Asset, key: 'id'}
    },
    date_of_issue: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    date_of_return: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true
    },
    deleted_at:{
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'assigned_asset',
    tableName: 'assigned_asset'
})


export default AssignedAsset;
