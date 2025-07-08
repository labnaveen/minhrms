'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('industry', [{
      name: 'IT',
      is_deleted: false,
      created_at: '2021-04-21 19:53:50',
      updated_at: '2021-04-21 19:53:50'
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('indsutry', null, {});
  }
};