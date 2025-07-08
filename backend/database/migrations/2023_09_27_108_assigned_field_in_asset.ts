//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("asset", "is_assigned", {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("asset", "is_assigned");
    }
}