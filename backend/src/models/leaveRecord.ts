import { DataTypes, Model } from "sequelize";
import User from "./user";
import { sequelize } from "../utilities/db";
import Approval from "./dropdown/status/approval";
import LeaveType from "./leaveType";
import DayType from "./dropdown/dayType/dayType";
import HalfDayType from "./dropdown/dayType/halfDayType";




class LeaveRecord extends Model{}

LeaveRecord.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    leave_type_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: LeaveType, key: 'id'}
    },
    day_type_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: DayType, key: 'id'}
    },
    half_day_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {model: HalfDayType, key: 'id'}
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: User, key: 'id'}
    },
    start_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    reason:{
        type: DataTypes.STRING,
        allowNull: true
    },
    document:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    contact_number:{
        type: DataTypes.STRING,
        allowNull: true
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references:{model: Approval, key: 'id'}
    },
    reject_reason: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_action_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {model: User, key: 'id'}
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'leave_record',
    tableName: 'leave_record'
})

export default LeaveRecord