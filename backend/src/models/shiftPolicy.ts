import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class ShiftPolicy extends Model{
    shift_start_time(shift_start_time: any): import("moment").MomentInput {
        throw new Error("Method not implemented.");
    }
    shift(shift: any): import("moment").MomentInput {
        throw new Error("Method not implemented.");
    }
}

ShiftPolicy.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    shift_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    shift_description:{
        type: DataTypes.STRING,
        allowNull: true
    },
    notes_for_punch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    allow_single_punch:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    shift_type_id: {
        type: DataTypes.INTEGER,
        references: {model: 'shift_type', key: 'id'}
    },
    shift_start_time:{
        type: DataTypes.TIME,
        allowNull: true
    },
    shift_end_time:{
        type: DataTypes.TIME,
        allowNull: true
    },
    pre_shift_duration:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    post_shift_duration:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    consider_breaks:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    break_duration:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    break_start_time:{
        type: DataTypes.TIME,
        allowNull: true
    },
    break_end_time:{
        type: DataTypes.TIME,
        allowNull: true
    },
    enable_grace:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    grace_duration_allowed:{
        type:DataTypes.INTEGER,
        allowNull: true
    },
    number_of_days_grace_allowed:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status_grace_exceeded:{
        type: DataTypes.INTEGER,
        references: {model:'attendance_status', key: 'id'}
    },
    enable_grace_recurring:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    enable_flex:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    flex_start_time:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    flexi_duration_allowed:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    number_of_days_flexi_allowed:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status_flexi_exceeded:{
        type: DataTypes.INTEGER,
        references: {model: 'attendance_status', key: 'id'},
        allowNull: true
    },
    status_punch_in_time_exceeded:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {model: 'attendance_status', key: 'id'}
    },
    enable_flex_recurring:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    base_working_hours: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'shift_policy',
    modelName: 'shift_policy'
})


export default ShiftPolicy;