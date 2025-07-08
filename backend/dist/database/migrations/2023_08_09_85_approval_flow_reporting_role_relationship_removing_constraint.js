"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.removeConstraint("approval_flow_reporting_role", "approval_flow_reporting_role_ibfk_1");
        await queryInterface.removeConstraint("approval_flow_reporting_role", "approval_flow_reporting_role_ibfk_2");
        await queryInterface.removeConstraint("approval_flow_reporting_role_undirect", "approval_flow_reporting_role_undirect_ibfk_1");
        await queryInterface.removeConstraint("approval_flow_reporting_role_undirect", "approval_flow_reporting_role_undirect_ibfk_2");
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.addConstraint("approval_flow_reporting_role", "approval_flow_reporting_role_ibfk_1");
        await queryInterface.addConstraint("approval_flow_reporting_role", "approval_flow_reporting_role_ibfk_2");
        await queryInterface.addConstraint("approval_flow_reporting_role_undirect", "approval_flow_reporting_role_undirect_ibfk_1");
        await queryInterface.addConstraint("approval_flow_reporting_role_undirect", "approval_flow_reporting_role_undirect_ibfk_2");
    },
};
