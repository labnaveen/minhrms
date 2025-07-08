'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('day_type', [
        {
            name:'Half Day',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            name: 'Full Day',
            created_at: new Date(),
            updated_at: new Date()
        }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('day_type', null, {});
  }
};
