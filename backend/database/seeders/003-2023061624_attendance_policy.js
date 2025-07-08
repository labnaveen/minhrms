'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('attendance_policy', [{
        name: "Glocalview Standard",
        description: "Standard Policy for GV",
        attendance_cycle_start: 1,
        biometric: false,
        web: true,
        app: true,
        manual: false,
        half_day: false,
        display_overtime_hours: true,
        created_at: '2021-03-21 19:53:50',
        updated_at: '2021-03-21 19:53:50'
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('attendance_policy', null, {});
  },

  order: 1
};
