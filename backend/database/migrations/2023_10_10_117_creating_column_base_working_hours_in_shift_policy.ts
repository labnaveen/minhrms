//@ts-nocheck

import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("shift_policy", "base_working_hours", {
            type: DataTypes.INTEGER,
            allowNull: true
        }),
        await queryInterface.changeColumn("shift_policy", "number_of_days_flexi_allowed", {
            type: DataTypes.INTEGER,
            allowNull: true
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("shift_policy", "base_working_hours");
        await queryInterface.changeColumn("shift_policy", "number_of_days_flexi_allowed", {
            type: DataTypes.STRING,
            allowNull: true
        })
    }
}