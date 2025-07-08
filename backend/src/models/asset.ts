import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";

class Asset extends Model{};


Asset.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    asset_code:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    asset_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_of_purchase:{
        type: DataTypes.DATE,
        allowNull: false
    },
    asset_cost:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true
    },
    is_assigned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'asset',
    modelName: 'asset',
    paranoid: true,
    deletedAt: 'deleted_at'
})

export default Asset;