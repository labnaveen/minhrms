import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class DayOfMonth extends Model{};


DayOfMonth.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        tableName: 'day_of_month',
        modelName: 'day_of_month'
    })


export default DayOfMonth;