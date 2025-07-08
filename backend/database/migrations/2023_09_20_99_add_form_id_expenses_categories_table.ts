//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("expenses_categories", "expense_category_form_id", {
            type: DataTypes.INTEGER,
            defaultValue: false,
            allowNull: false
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("expenses_categories", "expense_category_form_id");
    }
}