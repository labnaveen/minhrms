import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class Approval extends Model{};


Approval.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        tableName: 'approval_status',
        modelName: 'approval_status'
    })


export default Approval;