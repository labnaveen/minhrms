//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("holiday_database", "custom_holiday", {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("holiday_database", "custom_holiday");
    }
}