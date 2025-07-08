'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('master_policy', [{
        policy_name: "Glocalview Master",
        policy_description: "hehe",
        attendance_policy_id: 1,
        base_leave_configuration_id: 1,
        shift_policy_id: 1,
        leave_workflow: 1,
        attendance_workflow: 1,
        weekly_off_policy_id: 1,
        holiday_calendar_id: 1,
        expense_workflow: 1,
        created_at: new Date(),
        updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('master_policy', null, {});
  },

  order:2
};
