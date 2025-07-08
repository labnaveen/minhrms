//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.changeColumn("education", "percentage", {
            type: DataTypes.FLOAT,
            allowNull: true,
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.changeColumn("education", "percentage", {
            type: DataTypes.INTEGER,
            allowNull: true
        });
    }
}