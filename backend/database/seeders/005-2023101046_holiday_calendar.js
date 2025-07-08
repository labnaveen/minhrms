'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('holiday_calendar', [{
        name: 'Standard Holiday Calendar',
        year: '2023',
        created_at: new Date(),
        updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('holiday_calendar', null, {});
  },

  order:2
};
