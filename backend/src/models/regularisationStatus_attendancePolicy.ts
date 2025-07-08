import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import AttendancePolicy from "./attendancePolicy";
import RegularisationStatus from "./regularisationStatus";
import AttendanceStatus from "./attendanceStatus";




class RegularisationStatusAttendancePolicy extends Model{};


RegularisationStatusAttendancePolicy.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    attendance_policy_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: AttendancePolicy, key: 'id'}
    },
    regularisation_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: AttendanceStatus, key: 'id'}
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'regularisation_status_attendance_policy',
    modelName: 'regularisation_status_attendance_policy'
})


export default RegularisationStatusAttendancePolicy