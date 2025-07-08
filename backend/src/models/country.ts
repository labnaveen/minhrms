import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class Country extends Model{}


Country.init({

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'country'
})

export default Country