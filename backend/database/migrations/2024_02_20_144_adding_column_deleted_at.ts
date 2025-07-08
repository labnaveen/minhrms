//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("asset", "deleted_at", {
            type: DataTypes.DATE
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("asset", "deleted_at");
    }
}