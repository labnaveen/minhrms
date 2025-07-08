'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('weekly_off_policy', [{
        name: 'Standard Weekly off policy',
        description: 'testing policy',
        created_at: new Date(),
        updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('weekly_off_policy', null, {});
  },

  order:2
};
