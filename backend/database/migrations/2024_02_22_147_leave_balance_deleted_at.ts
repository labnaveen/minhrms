//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("leave_balance", "deleted_at", {
            type: DataTypes.DATE
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("leave_balance", "deleted_at");
    }
}