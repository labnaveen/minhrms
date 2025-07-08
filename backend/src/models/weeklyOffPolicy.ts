import { Model } from "sequelize";
import { sequelize } from "../utilities/db";
import { DataType } from "sequelize-typescript";

class WeeklyOffPolicy extends Model{};


WeeklyOffPolicy.init({
    id:{
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: DataType.STRING,
        allowNull: false,
        unique: true
    },
    description:{
        type: DataType.STRING,
        allowNull: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'weekly_off_policy',
    modelName: 'weekly_off_policy'
})

export default WeeklyOffPolicy;