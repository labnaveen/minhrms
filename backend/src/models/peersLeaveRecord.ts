import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import LeaveRecord from "./leaveRecord";
import User from "./user";


class PeersLeaveRecord extends Model{}


PeersLeaveRecord.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    leave_record_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: LeaveRecord, key: 'id'}
    },
    peer_user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: User, key: 'id'}
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'peers_leave_record',
    tableName: 'peers_leave_record'
})

export default PeersLeaveRecord