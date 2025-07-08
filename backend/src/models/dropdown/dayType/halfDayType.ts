import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";



class HalfDayType extends Model{};


HalfDayType.init({
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
    modelName: 'half_day_type',
    tableName: 'half_day_type'
})

export default HalfDayType;