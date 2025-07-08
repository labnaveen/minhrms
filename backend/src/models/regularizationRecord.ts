import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import RegularisationStatus from "./regularisationStatus";
import RegularizationRequestStatus from "./regularizationRequestStatus";
import AttendanceStatus from "./attendanceStatus";
import Approval from "./dropdown/status/approval";



class RegularizationRecord extends Model{}


RegularizationRecord.init({

    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'user', key:'id'}
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    in_time:{
        type: DataTypes.DATE,
        allowNull: false
    },
    out_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    request_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: AttendanceStatus, key: 'id'}
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {model: Approval, key: 'id'}
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'regularization_record',
    modelName: 'regularization_record'
})

export default RegularizationRecord;