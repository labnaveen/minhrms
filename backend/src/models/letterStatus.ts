import { DataTypes, Model } from "sequelize";
import Letter from "./letter";
import { sequelize } from "../utilities/db";




class LetterStatus extends Model{};


LetterStatus.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'letter_status',
    modelName: 'letter_status'
})


export default LetterStatus