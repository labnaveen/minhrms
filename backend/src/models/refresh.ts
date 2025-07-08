import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";


class Refresh extends Model{}

Refresh.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    session_id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    refresh_token:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    fcm_token:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    device_id:{
        type: DataTypes.TEXT,
        allowNull: true
    }
},{
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'refresh'
})

export default Refresh