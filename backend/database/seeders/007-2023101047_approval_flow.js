'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('approval_flow', [{
        name: 'Standard Approval Flow',
        description: 'Testing default flow',
        approval_flow_type_id: 1,
        created_at: new Date(),
        updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('approval_flow', null, {});
  },

  order:2
};
