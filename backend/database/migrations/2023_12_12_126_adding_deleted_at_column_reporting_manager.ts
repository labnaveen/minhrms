//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("reporting_managers", "deleted_at", {
            type: DataTypes.DATE,
            allowNull: true
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("reporting_managers", "deleted_at");
    }
}