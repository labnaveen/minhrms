import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import RegularizationRecord from "./regularizationRecord";
import User from "./user";
import Approval from "./dropdown/status/approval";
import RegularisationStatus from "./regularisationStatus";



class RegularisationRequestHistory extends Model{}

RegularisationRequestHistory.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    regularisation_record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RegularizationRecord,
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
    tableName: 'regularisation_request_history'
})

export default RegularisationRequestHistory