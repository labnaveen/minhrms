import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class HolidayCalendar extends Model{}


HolidayCalendar.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    sequelize,
    underscored:true,
    timestamps: true,
    tableName: 'holiday_calendar',
    modelName: 'holiday_calendar'
})

export default HolidayCalendar;