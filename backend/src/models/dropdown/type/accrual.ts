import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class Accrual extends Model{};


Accrual.init({
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
        tableName: 'accrual_type',
        modelName: 'accrual_type'
    })


export default Accrual;