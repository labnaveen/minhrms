import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class Shift extends Model{};


Shift.init({
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
        tableName: 'shift_type',
        modelName: 'shift_type'
    })


export default Shift;