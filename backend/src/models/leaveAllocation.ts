import { DataTypes, Model } from "sequelize";
import LeaveTypePolicy from "./leaveTypePolicy";
import Months from "./dropdown/chronology/months";
import { sequelize } from "../utilities/db";




class LeaveAllocation extends Model{};



LeaveAllocation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    leave_type_policy_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: LeaveTypePolicy, key: 'id'}
    },
    month_number:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: Months, key: 'id'}
    },
    allocated_leaves: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'leave_allocation',
    modelName: 'leave_allocation'
})


export default LeaveAllocation