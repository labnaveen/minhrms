import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class ProfileChangeRequests extends Model{};


ProfileChangeRequests.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    profile_change_record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'profile_change_record', key: 'id'}
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: 'user', key: 'id'}
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model:'approval_status', key: 'id'},
        defaultValue: 1
    },
    priority:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'profile_change_request',
    modelName: 'profile_change_request'
})

export default ProfileChangeRequests