import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import AttendanceStatus from "./attendanceStatus";
import DayOfMonth from "./dropdown/chronology/day_of_month";

class AttendancePolicy extends Model{};

AttendancePolicy.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    // working_hours:{
    //     type: DataTypes.FLOAT,
    //     allowNull: false
    // },
    attendance_cycle_start:{
        type: DataTypes.INTEGER,
        references: {model: DayOfMonth, key: 'id'},
        allowNull: false,
        defaultValue: 1
    },
    biometric:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    web:{
        type:DataTypes.BOOLEAN,
        defaultValue: false
    },
    app:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    manual:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    default_attendance_status:{
        type: DataTypes.INTEGER,
        references: {model: AttendanceStatus, key: 'id'},
        defaultValue: 1
    },
    // overtime_rule:{
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    // regularisation_status:{
    //     type: DataTypes.STRING,
    //     allowNull: false,
    // },
    half_day:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    min_hours_for_half_day:{
        type: DataTypes.FLOAT,
    },
    display_overtime_hours:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_deficit_hours:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_late_mark:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_average_working_hours:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_present_number_of_days:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_absent_number_of_days:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_number_of_leaves_taken:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_average_in_time:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_average_out_time:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    flexibility_hours:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    call_out_regularisation:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    round_off:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    auto_approval_attendance_request:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    regularisation_restriction:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    regularisation_restriction_limit:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    regularisation_limit_for_month:{
        type: DataTypes.INTEGER,   
    },
    bypass_regularisation_proxy:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    location_based_restriction:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    location_mandatory:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    distance_allowed:{
        type: DataTypes.STRING,
        allowNull: true
    },
    mobile_app_restriction: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    number_of_devices_allowed: {
        type: DataTypes.STRING,
        allowNull: true
    }
  
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'attendance_policy',
    modelName: 'attendance_policy'
})

export default AttendancePolicy;