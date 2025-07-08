import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";




class DivisionUnits extends Model{};

DivisionUnits.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    unit_name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    division_id:{
        type: DataTypes.INTEGER,
        references: {model: 'division', key: 'id'}
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
    tableName: 'division_units',
    modelName: 'division_units'
})

export default DivisionUnits