import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class RoundingTime extends Model{};


RoundingTime.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        tableName: 'rounding_time'
    })


export default RoundingTime;