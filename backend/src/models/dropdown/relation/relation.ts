import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utilities/db";




class Relation extends Model{};


Relation.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'relation',
    modelName: 'relation'
})


export default Relation;