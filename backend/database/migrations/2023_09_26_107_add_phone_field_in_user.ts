//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("user", "phone", {
            type: DataTypes.STRING,
            allowNull: false,
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("user", "phone");
    }
}