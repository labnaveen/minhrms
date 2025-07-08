'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('base_leave_configuration', [{
        policy_name: "GV Standard Policy",
        policy_description: "Initial Testing",
        leave_calendar_from: 1,
        proxy_leave_application: false,
        leave_request_status: true,
        leave_balance_status: true,
        contact_number_allowed: true,
        contact_number_mandatory: true,
        reason_for_leave: true,
        reason_for_leave_mandatory: true,
        notify_peer: true,
        leave_rejection_reason: true,
        created_at: new Date(),
        updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('base_leave_configuration', null, {});
  }
};
