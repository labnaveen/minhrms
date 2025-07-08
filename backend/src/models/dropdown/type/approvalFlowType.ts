import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";





class ApprovalFlowType extends Model{}



ApprovalFlowType.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'approval_flow_type',
    modelName: 'approval_flow_type'
})

export default ApprovalFlowType