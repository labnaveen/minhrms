"use strict";
//@ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../../src/models/index");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.createTable('permissions_roles', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            permissions_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            roles_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE
            }
        });
        const roles = await index_1.Roles.findByPk(1);
        const permissions = await index_1.Permissions.findAll();
        if (roles?.id && permissions.length > 0) {
            const rolePermission = permissions.map((perm) => {
                return { roles_id: roles.id, permissions_id: perm.id };
            });
            await queryInterface.bulkInsert('permissions_roles', rolePermission);
        }
    },
    down: async ({ context: queryInterface }) => {
        // logic for reverting the changes
        await queryInterface.dropTable('permissions_roles');
    }
};
