//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("user_division", "division_id", {
            type: DataTypes.INTEGER,
            allowNull: false
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("user_division", "division_id");
    }
}