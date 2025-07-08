import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utilities/db";

class Roles extends Model{
  id: any;
}

Roles.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    alias:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_system_generated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

},{
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'roles',
    tableName: 'roles'
})


export default Roles

