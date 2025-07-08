import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class LeaveBalance extends Model{}


LeaveBalance.init({

    id:{
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id'}
    },
    leave_type_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'leave_type', key: 'id'}
    },
    leave_balance:{
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0
    },
    total_leaves: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'leave_balance',
    paranoid: true,
    deletedAt: 'deleted_at'
})


export default LeaveBalance