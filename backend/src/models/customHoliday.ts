import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class CustomHoliday extends Model{};


CustomHoliday.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        allowNull: false
    },
    holiday_calendar_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'holiday_calendar', key: 'id'}
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    }
    
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'custom_holiday',
    tableName: 'custom_holiday'
})


export default CustomHoliday