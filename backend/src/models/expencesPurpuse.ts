import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class expencesPurpuse extends Model{}


expencesPurpuse.init({

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
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'expencesPurpuse',
    tableName: 'expense_purpuse'
})

export default expencesPurpuse