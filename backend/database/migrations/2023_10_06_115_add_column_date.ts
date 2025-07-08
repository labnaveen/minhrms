//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("regularization_record", "date", {
            type: DataTypes.DATEONLY,
            allowNull: false
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("regularization_record", "date");
    }
}