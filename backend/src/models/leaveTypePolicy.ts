import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import Accurals from "./dropdown/type/accrual";
import AccrualFrequency from "./dropdown/frequency/accrualFrequency";
import AccrualFrom from "./dropdown/chronology/accrualFrom";
import LeaveType from "./leaveType";




class LeaveTypePolicy extends Model{};


LeaveTypePolicy.init({

    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    leave_type_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: LeaveType, key: 'id'}
    },
    leave_policy_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true
    },
    accrual_frequency:{
        type: DataTypes.INTEGER,
        references: {model: AccrualFrequency, key: 'id'}
    },
    accrual_type:{
        type: DataTypes.INTEGER,
        references: {model: Accurals, key: 'id'}
    },
    accrual_from:{
        type: DataTypes.INTEGER,
        references: {model: AccrualFrom, key:'id'}
    },
    accrual_from_custom_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    advance_accrual_for_entire_leave_year:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    annual_eligibility:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    annual_breakup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'leave_type_policy',
    modelName: 'leave_type_policy'
})

export default LeaveTypePolicy;