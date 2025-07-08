import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";

class RegularizationRequestStatus extends Model{};

RegularizationRequestStatus.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'regularization_request_status',
    modelName: 'regularization_request_status'
})

export default RegularizationRequestStatus;