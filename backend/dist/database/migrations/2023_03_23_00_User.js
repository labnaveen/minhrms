"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.createTable('user', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            employee_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            employee_generated_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            date_of_joining: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            probation_period: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            probation_due_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true
            },
            designation: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            department: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            work_location: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            level: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            grade: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            cost_center: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            employee_official_email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            employee_personal_email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            dob_adhaar: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            dob_celebrated: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true
            },
            employee_gender: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            role_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            employee_password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            blood_group: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            nationality: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            mother_tongue: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            alternate_email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            alternate_contact: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            religion: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            bank_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            bank_branch: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            account_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            ifsc_code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            payroll_details: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            account_holder_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            pan_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            adhaar_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE
            },
            deleted_at: {
                type: sequelize_1.DataTypes.DATE
            }
        });
    },
    down: async ({ context: queryInterface }) => {
        // logic for reverting the changes
        await queryInterface.dropTable('user');
    }
};
