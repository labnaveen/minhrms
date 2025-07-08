import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utilities/db";

class Permissions extends Model{}

Permissions.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    level:{
        type: DataTypes.TEXT
    },
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'permissions'
})

export default Permissions