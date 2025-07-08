import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class HolidayCalendarAssociation extends Model{};


HolidayCalendarAssociation.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
    },
    holiday_calendar_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'holiday_calendar', key: 'id'}
    },
    holiday_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'holiday_database', key: 'id'}
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'holiday_calendar_association',
    tableName: 'holiday_calendar_association'
})

export default HolidayCalendarAssociation