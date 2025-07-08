//@ts-nocheck
import { DataTypes, Sequelize, UUIDV4 } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("refresh", "session_id", {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue:DataTypes.UUIDV4
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("refresh", "session_id");
    }
}