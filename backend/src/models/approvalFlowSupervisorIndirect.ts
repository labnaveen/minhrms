import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class ApprovalFlowSupervisorIndirect extends Model{}


ApprovalFlowSupervisorIndirect.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    approval_flow_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'approval_flow', key: 'id'}
    },
    supervisor_role_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{model: 'user', key: 'id'}
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'approval_flow_supervisor_indirect',
    tableName: 'approval_flow_supervisor_indirect'
})


export default ApprovalFlowSupervisorIndirect