import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";


class AttendanceStatus extends Model{}


AttendanceStatus.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name:{
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    sequelize,
    underscored: true,  
    timestamps: true,
    tableName: 'attendance_status',
    modelName: 'attendance_status'
})

export default AttendanceStatus;
