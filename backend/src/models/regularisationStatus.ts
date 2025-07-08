import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";


class RegularisationStatus extends Model{}

RegularisationStatus.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'regularisation_status',
    modelName: 'regularisation_status'
})

export default RegularisationStatus