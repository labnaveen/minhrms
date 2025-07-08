import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";


class EmploymentType extends Model{};


EmploymentType.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    tableName: 'employment_type',
    modelName: 'employment_type'
})


export default EmploymentType;