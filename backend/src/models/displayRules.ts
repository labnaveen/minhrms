import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class DisplayRules extends Model{};

DisplayRules.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'display_rules'
})