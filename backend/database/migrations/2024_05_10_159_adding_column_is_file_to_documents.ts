//@ts-nocheck
import { DataTypes, Sequelize, UUIDV4 } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("documents", "is_file", {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("documents", "is_file");
    }
}