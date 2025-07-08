'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('expenses_approval_status', [
      {
        name: 'Draft',
        border_hex_color: '#CDCDCD',
        button_hex_color: '#FAFAFA',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pending',
        border_hex_color: '#F6BB42',
        button_hex_color: '#FFF9ED',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Approved',
        border_hex_color: '#00B087',
        button_hex_color: '#E6F8F3',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Cancelled',
        border_hex_color: '#D85A19',
        button_hex_color: '#FCEFE8',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Rejected',
        border_hex_color: '#FF684F',
        button_hex_color: '#FFF0EE',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('expenses_approval_status', null, {});
  }
};
