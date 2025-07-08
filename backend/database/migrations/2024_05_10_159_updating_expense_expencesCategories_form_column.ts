//@ts-nocheck
import { DataTypes } from "sequelize";

module.exports = {
  up: async({context: queryInterface}) => {
    await queryInterface.changeColumn("expenses_categories", "expense_category_form_id", {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'expenses_categories_forms', key: 'id' }
    })
  },

  down: async({context: queryInterface}) => {
    await queryInterface.changeColumn("expenses_categories", "expense_category_form_id", {
        type: DataTypes.INTEGER,
        allowNull: false,
    })
  },
};


