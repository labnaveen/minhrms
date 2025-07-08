'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('expenses_categories_forms', [
        {
          category_form_name:'Travel Form'
        },
        {
          category_form_name: 'Food Form'
        },
        {
          category_form_name: 'Stay Form'
        },
        {
          category_form_name: 'Other Form'
        }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('expenses_categories_forms', null, {});
  }
};
