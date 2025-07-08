//@ts-nocheck

import { QueryInterface, DataTypes } from "sequelize";
import {Permissions, Roles} from '../../src/models/index'




module.exports = {
    up: async ({context: queryInterface}) => {
      // logic for transforming into the new state
      await queryInterface.createTable('permissions_roles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        permissions_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        roles_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_deleted:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at:{
            type: DataTypes.DATE
        },
        updated_at:{
            type: DataTypes.DATE
        }
      })

      const roles = await Roles.findByPk(1)
      const permissions = await Permissions.findAll()
      if(roles?.id && permissions.length>0){
        const rolePermission = permissions.map((perm) => {
          return { roles_id: roles.id, permissions_id: perm.id };
        });
        await queryInterface.bulkInsert('permissions_roles', rolePermission);
      }


    },
    down: async ({context: queryInterface}) => {
      // logic for reverting the changes
      await queryInterface.dropTable('permissions_roles')
    }
}