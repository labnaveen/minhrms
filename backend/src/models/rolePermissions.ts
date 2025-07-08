import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utilities/db";
import Permissions from "./permissions";
import Roles from "./roles";




class RolePermissions extends Model{};


RolePermissions.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    permissions_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: Permissions, key: 'id'}
    },
    roles_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model: Roles, key: 'id'}
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'permissions_roles',
    modelName: 'permissions_roles'
})


export default RolePermissions;