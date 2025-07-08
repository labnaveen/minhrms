import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import ApprovalFlow from "./approvalFlow";
import ReportingRole from "./reportingRole";



class ApprovalFlowReportingRole extends Model{}


ApprovalFlowReportingRole.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    approval_flow_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'approval_flow', key: 'id'}
    },
    reporting_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: 'reporting_role', key: 'id'}
    },
}, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'approval_flow_reporting_role',
    modelName: 'approval_flow_reporting_role'
})


export default ApprovalFlowReportingRole