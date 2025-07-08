import { sequelize } from "../utilities/db";
import { DataTypes, Model } from "sequelize";




class ShiftType extends Model{};


ShiftType.init({

    id:{
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'shift_type',
    modelName: 'shift_type'
})