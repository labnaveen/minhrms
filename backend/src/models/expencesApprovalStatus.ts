import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class expencesApprovalStatus extends Model { }


expencesApprovalStatus.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    border_hex_color: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    button_hex_color: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'expencesApprovalStatus',
    tableName: 'expenses_approval_status'
})

export default expencesApprovalStatus