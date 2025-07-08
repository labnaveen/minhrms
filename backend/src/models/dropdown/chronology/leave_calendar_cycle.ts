import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class LeaveCalendarCycle extends Model{};


LeaveCalendarCycle.init({
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
        tableName: 'leave_calendar_cycle'
    })


export default LeaveCalendarCycle;