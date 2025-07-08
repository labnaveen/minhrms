import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class Notification extends Model{}


Notification.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id'}
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image:{
        type: DataTypes.STRING,
        allowNull: true
    },
    read:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'notification',
    modelName: 'notification'
})


export default Notification;