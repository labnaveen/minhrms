import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class Rounding extends Model{};


Rounding.init({
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
        tableName: 'rounding_type'
    })


export default Rounding;