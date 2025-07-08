import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import Attendance from "./attendance";


class PunchLocation extends Model{};



PunchLocation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    attendance_log_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Attendance, key: 'id' }
    },
    punch_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: false
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'punch_location',
    modelName: 'punch_location'
})

export default PunchLocation;