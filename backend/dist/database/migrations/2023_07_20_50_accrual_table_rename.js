"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.renameTable("accural_type", "accrual_type");
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("accrual_type", "accural_type");
    },
};
