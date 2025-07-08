'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('employee_address', [{
      employee_present_address:'C-13, Sector-13, Noida',
      employee_present_pincode: 201301,
      employee_present_city: 'Noida',
      employee_present_state: 'Uttar Pradesh',
      employee_present_country_id: 101,
      employee_present_mobile: 9773914237,
      employee_permanent_address: 'C-13, Sector-13, Noida',
      employee_permanent_pincode: 201301,
      employee_permanent_city: 'Noida',
      employee_permanent_state: 'Uttar Pradesh',
      employee_permanent_country_id: 101,
      employee_permanent_mobile: 9773914237,
      user_id:1,
      is_deleted: false,
      created_at: '2021-03-21 19:53:50',
      updated_at: '2021-03-21 19:53:50'
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('employee_address', null, {});
  }
};
