import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class RegularizationRequest extends Model{}


RegularizationRequest.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    regularization_record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'regularization_record', key: 'id'}
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: 'user', key: 'id'}
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model:'regularisation_status', key: 'id'},
        defaultValue: 2
    },
    priority:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'regularization_request',
    modelName: 'regularization_request'
})

export default RegularizationRequest