import {DataTypes, Model} from "sequelize"
import { sequelize } from "../utilities/db"


class BaseLeaveConfiguration extends Model{}


BaseLeaveConfiguration.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        allowNull: false  
    },
    policy_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    policy_description:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    leave_calendar_from:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    custom_month:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    proxy_leave_application:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    leave_request_status:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    leave_balance_status:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    contact_number_allowed:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    contact_number_mandatory:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    reason_for_leave:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    reason_for_leave_mandatory:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    notify_peer:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    notify_peer_mandatory:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    leave_rejection_reason:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

},{
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'base_leave_configuration',
    tableName: 'base_leave_configuration'
})


export default BaseLeaveConfiguration
