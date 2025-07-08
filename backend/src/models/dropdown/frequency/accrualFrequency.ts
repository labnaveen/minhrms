import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";




class AccrualFrequency extends Model{};


AccrualFrequency.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'accrual_frequency',
    modelName: 'accrual_frequency'
})


export default AccrualFrequency;