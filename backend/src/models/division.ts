import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class Division extends Model{};

Division.init({

    id:{
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    division_name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    system_generated:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'division',
    modelName: 'division'
})


export default Division
