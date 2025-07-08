//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("expenses", "stay_from_date", {
            type: DataTypes.DATEONLY,
            allowNull: true
        }),
        await queryInterface.addColumn("expenses", "stay_to_date", {
            type: DataTypes.DATEONLY,
            allowNull: true
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("expenses", "stay_from_date");
        await queryInterface.deleteColumn("expenses", "stay_to_date");
    }
}