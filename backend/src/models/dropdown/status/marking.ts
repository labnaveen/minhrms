import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class Marking extends Model{};


Marking.init({
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
        tableName: 'marking_status'
    })


export default Marking;