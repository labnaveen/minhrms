import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class LeaveRequest extends Model{
    reporting_manager: any;
    approval_status: any;
    updatedAt: any;
};


LeaveRequest.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    leave_record_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'leave_record', key: 'id'}
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: 'user', key: 'id'}
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model:'approval_status', key: 'id'},
        defaultValue: 1
    },
    priority:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}, {
    sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'leave_request',
    modelName: 'leave_request'
})

export default LeaveRequest;

