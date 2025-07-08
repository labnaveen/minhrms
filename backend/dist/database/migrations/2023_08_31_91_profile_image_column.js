"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.addColumn('user', 'profile_image_id', {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        });
    },
    down: async ({ context: queryInterface }) => {
        // logic for reverting the changes
        await queryInterface.removeColumn('user', 'profile_image');
    }
};
