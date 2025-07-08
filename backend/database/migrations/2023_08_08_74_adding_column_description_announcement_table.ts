//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn('announcement', 'description', {
            type: DataTypes.STRING,
            allowNull: true
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.removeColumn('announcement', 'description')
    }
}