//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("leave_balance", "total_leaves", {
            type: DataTypes.FLOAT,
            defaultValue: false,
            allowNull: false
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("leave_balance", "total_leaves");
    }
}