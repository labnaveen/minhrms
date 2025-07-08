import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class ProfileChangeRecord extends Model{}

ProfileChangeRecord.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id'}
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false
    },
    previous: {
        type: DataTypes.JSON,
        allowNull: false
    },
    change: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model:'approval_status', key: 'id'},
        defaultValue: 1
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'profile_change_record',
    modelName: 'profile_change_record'
})

export default ProfileChangeRecord