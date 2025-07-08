'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('division', [
        {
            division_name: 'Designation',
            system_generated: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            division_name: 'Department',
            system_generated: true,
            created_at: new Date(),
            updated_at: new Date()
        }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('division', null, {});
  }
};
