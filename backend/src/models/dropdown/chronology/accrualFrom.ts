import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";

class AccrualFrom extends Model{};


AccrualFrom.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'accrual_from',
    modelName: 'accrual_from'
})


export default AccrualFrom;