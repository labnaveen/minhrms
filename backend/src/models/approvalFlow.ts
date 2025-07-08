import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class ApprovalFlow extends Model{}


ApprovalFlow.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    approval_flow_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: 'approval_flow_type', key: 'id'}
    },
    confirm_by_both_direct_undirect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmation_by_all: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmation_by_all_direct: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmation_by_all_indirect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'approval_flow',
    modelName: 'approval_flow'
})

export default ApprovalFlow