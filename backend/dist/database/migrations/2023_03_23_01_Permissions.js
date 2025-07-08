"use strict";
//@ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
var entities = [];
var now = new Date();
// entities.push({ name: 'permissions.list', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'permissions.create', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'permissions.show', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'permissions.update', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'permissions.destroy', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'permissions.status', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'users.list', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'users.create', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'users.show', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'users.update', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'users.destroy', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'users.status', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'roles.list', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'roles.create', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'roles.show', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'roles.update', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'roles.destroy', level:'high', status: 1, created_at: now, updated_at: now });
// entities.push({ name: 'roles.status', level:'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_dashboard.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_dashboard.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_dashboard.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_dashboard.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_attendance.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_attendance.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_attendance.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_attendance.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_leaves.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_leaves.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_leaves.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_leaves.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_notifications.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_notifications.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_notifications.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_notifications.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_profile.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_profile.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_profile.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_profile.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'manager_dashboard.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'manager_dashboard.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'manager_dashboard.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'manager_dashboard.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'regularisation_requests.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'regularisation_requests.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'regularisation_requests.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'regularisation_requests.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'leave_requests.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'leave_requests.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'leave_requests.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'leave_requests.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'reimbursements_requests.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'reimbursements_requests.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'reimbursements_requests.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'reimbursements_requests.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'profile_update_requests.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'profile_update_requests.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'profile_update_requests.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'profile_update_requests.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'admin_dashboard.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'admin_dashboard.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'admin_dashboard.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'admin_dashboard.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_list.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_list.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_list.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_list.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'policies_summary.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'policies_summary.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'policies_summary.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'policies_summary.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'division.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'division.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'division.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'division.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'reporting_structure.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'reporting_structure.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'reporting_structure.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'reporting_structure.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'approval_flow.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'approval_flow.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'approval_flow.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'approval_flow.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'manage_assets.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'manage_assets.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'manage_assets.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'manage_assets.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'assign_assets.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'assign_assets.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'assign_assets.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'assign_assets.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'role_permissions.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'role_permissions.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'role_permissions.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'role_permissions.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'announcements.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'announcements.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'announcements.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'announcements.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'attendance_policies.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'attendance_policies.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'attendance_policies.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'attendance_policies.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'leave_policies.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'leave_policies.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'leave_policies.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'leave_policies.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'weekly_off_policies.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'weekly_off_policies.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'weekly_off_policies.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'weekly_off_policies.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'master_policies.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'master_policies.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'master_policies.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'master_policies.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'holiday_calendar.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'holiday_calendar.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'holiday_calendar.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'holiday_calendar.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'other_employee.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'other_employee.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'other_employee.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'other_employee.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'admin_reports.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'admin_reports.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'admin_reports.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'admin_reports.delete', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_expense.view', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_expense.add', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_expense.edit', level: 'high', status: 1, created_at: now, updated_at: now });
entities.push({ name: 'employee_expense.delete', level: 'high', status: 1, created_at: now, updated_at: now });
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.createTable('permissions', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            level: {
                type: sequelize_1.DataTypes.TEXT
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
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
        return queryInterface.bulkInsert('permissions', entities);
    },
    down: async ({ context: queryInterface }) => {
        // logic for reverting the changes
        await queryInterface.dropTable('permissions');
    }
};
