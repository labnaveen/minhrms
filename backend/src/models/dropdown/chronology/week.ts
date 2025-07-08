import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class Week extends Model{};


Week.init({
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
        tableName: 'week',
        modelName: 'week'
    })


export default Week;