import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";




class Gender extends Model{}


Gender.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'gender',
    modelName: 'gender'
})

export default Gender