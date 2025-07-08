import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class EducationType extends Model{};


EducationType.init({
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
    tableName: 'education_type',
    modelName: 'education_type'
})


export default EducationType;