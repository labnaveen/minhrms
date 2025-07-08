import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";



class DayType extends Model{};


DayType.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'day_type',
    tableName: 'day_type'
})

export default DayType;