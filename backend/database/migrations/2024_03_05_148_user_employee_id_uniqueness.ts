//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.changeColumn("user", "employee_generated_id", {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.changeColumn("user", "employee_generated_id");
    }
}