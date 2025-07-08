'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('expense_purpuse', [
      {
        name: 'Client Meeting',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Service',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Other',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('expense_purpuse', null, {});
  }
};
