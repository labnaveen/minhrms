import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class Industry extends Model{}


Industry.init({

    id:{
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'industry'
})


export default Industry