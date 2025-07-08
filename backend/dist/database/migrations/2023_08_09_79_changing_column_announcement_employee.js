"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("announcement_employee", "employee_id", "user_id");
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("announcement_employee", "user_id", "employee_id");
    },
};
