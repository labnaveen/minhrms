import { Model } from "sequelize"
import { sequelize } from "../utilities/db"
import { DataType } from "sequelize-typescript"
import MasterPolicy from "./masterPolicy"
import LeaveType from "./leaveType"
import LeaveTypePolicy from "./leaveTypePolicy"



class MasterPolicyLeavePolicy extends Model{};



MasterPolicyLeavePolicy.init({
    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    master_policy_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {model: MasterPolicy, key: 'id'}
    },
    leave_type_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {model: LeaveType, key: 'id'}
    },
    leave_type_policy_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {model: LeaveTypePolicy, key: 'id'}
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'master_policy_leave_policy',
    modelName: 'master_policy_leave_policy'
})

export default MasterPolicyLeavePolicy;