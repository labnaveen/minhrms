import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import BaseLeaveConfiguration from "./baseLeaveConfiguration";
import ShiftPolicy from "./shiftPolicy";
import ApprovalFlow from "./approvalFlow";
import WeeklyOffPolicy from "./weeklyOffPolicy";
import HolidayCalendar from "./holidayCalendar";



class MasterPolicy extends Model{}


MasterPolicy.init({

    id:{
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    policy_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    policy_description:{
        type: DataTypes.TEXT,
        allowNull: true,
    },
    attendance_policy_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'attendance_policy', key: 'id'}
    },
    base_leave_configuration_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: BaseLeaveConfiguration, key: 'id'}
    },
    shift_policy_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: ShiftPolicy, key: 'id'}
    },
    weekly_off_policy_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: WeeklyOffPolicy, key: 'id'}
    },
    holiday_calendar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: HolidayCalendar, key: 'id'}
    },
    leave_workflow:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: ApprovalFlow, key: 'id'}
    },
    attendance_workflow:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: ApprovalFlow, key: 'id'}
    },
    expense_workflow: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: ApprovalFlow, key: 'id'}
    },
    profile_change_workflow: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {model: ApprovalFlow, key: 'id'}
    }
},{
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'master_policy',
    modelName: 'master_policy'
})


export default MasterPolicy