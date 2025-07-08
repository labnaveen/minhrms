import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import User from "./user";
import AttendanceStatus from "./attendanceStatus";


class Attendance extends Model{};

Attendance.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        references: {model: User, key: 'id'}
    },
    employee_generated_id:{
        type: DataTypes.STRING,
        allowNull: false
    },
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    punch_in_time:{
        type: DataTypes.DATE,
    },
    punch_out_time:{
        type: DataTypes.DATE,
        allowNull: true
    },
    status:{
        type: DataTypes.INTEGER,
        defaultValue: 1,
        references: {model: AttendanceStatus, key: 'id'}
    },
    flexi_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    grace_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    flexi_counter: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    grace_counter: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'attendance',
    modelName: 'attendance'
})


export default Attendance;