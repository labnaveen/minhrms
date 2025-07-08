import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class HolidayDatabase extends Model{};


HolidayDatabase.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false   
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    custom_holiday: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'holiday_database',
    modelName: 'holiday_database'
})

export default HolidayDatabase;