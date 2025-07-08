'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('expenses_categories', [
        {
          category_name:'Stay',
          expense_category_form_id: 3
        },
        {
          category_name: 'Food',
          expense_category_form_id: 2
        },
        {
          category_name: 'Travel',
          expense_category_form_id: 1
        },
        {
          category_name: 'Good & Services',
          expense_category_form_id: 4
        },
        {
          category_name: 'Other',
          expense_category_form_id: 4
        }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('expenses_categories', null, {});
  }
};
