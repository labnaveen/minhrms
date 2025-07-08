"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('letter', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'user', key: 'id' }
            },
            document_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'documents', key: 'id' }
            },
            letter_type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            status: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'letter_status', key: 'id' }
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE
            }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('letter');
    }
};
