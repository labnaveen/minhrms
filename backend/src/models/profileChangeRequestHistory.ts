import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import User from "./user";
import Approval from "./dropdown/status/approval";
import LeaveRecord from "./leaveRecord";
import ProfileChangeRecord from "./profileChangeRecord";



class ProfileChangeRequestHistory extends Model{}

ProfileChangeRequestHistory.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    profile_change_record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProfileChangeRecord,
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,   
    },
    status_before: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Approval,
            key: 'id'
        }
    },
    status_after: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Approval,
            key: 'id'
        }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'profile_change_request_history'
})

export default ProfileChangeRequestHistory