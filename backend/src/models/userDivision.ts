import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";



class UserDivision extends Model{};


UserDivision.init({

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'user', key: 'id'}
    },
    unit_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'division_units', key: 'id'}
    },
    division_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: 'division', key: 'id'}
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'user_division',
    modelName: 'user_division'
})


export default UserDivision