"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('expenses', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'user', key: 'id' }
            },
            category_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'expenses_categories', key: 'id' }
            },
            status_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'expenses_approval_status', key: 'id' }
            },
            purpose_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'expense_purpuse', key: 'id' }
            },
            transaction_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            billing_status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            bill_no: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            from_location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            to_location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            from_latitude: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            },
            from_longitude: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            },
            to_latitude: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            },
            to_longitude: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            },
            total_distance: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            },
            merchant_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            amount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            note: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            purpose_text: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            supporting_doc_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
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
        await queryInterface.dropTable('expenses');
    }
};
