//@ts-nocheck
import { DataTypes, Sequelize, UUIDV4 } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("expenses", "comment", {
            type: DataTypes.STRING,
            allowNull: true,
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("expenses", "comment");
    }
}