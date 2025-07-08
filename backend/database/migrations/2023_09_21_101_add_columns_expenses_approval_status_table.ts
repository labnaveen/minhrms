//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("expenses_approval_status", "border_hex_color", {
            type: DataTypes.STRING,
            allowNull: false
        }),
        await queryInterface.addColumn("expenses_approval_status", "button_hex_color", {
            type: DataTypes.STRING,
            allowNull: false
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("expenses_approval_status", "border_hex_color");
        await queryInterface.deleteColumn("expenses_approval_status", "button_hex_color");
    }
}