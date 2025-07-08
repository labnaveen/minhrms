'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('leave_balance', [{
        user_id: 1,
        leave_type_id: 1,
        leave_balance: 5,
        created_at: new Date(),
        updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('leave_balance', null, {});
  }
};
