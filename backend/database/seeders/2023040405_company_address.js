'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('company_address', [{
      company_present_address:'A-63, Sector-67, Noida',
      company_present_pincode: 201301,
      company_present_city: 'Noida',
      company_present_state: 'Uttar Pradesh',
      company_present_country_id: 101,
      company_present_mobile: 9773914237,
      company_permanent_address: 'A-63, Sector-67, Noida',
      company_permanent_pincode: 201301,
      company_permanent_city: 'Noida',
      company_permanent_state: 'Uttar Pradesh',
      company_permanent_country_id: 101,
      company_permanent_mobile: 9773914237,
      company_id:1,
      is_deleted: false,
      created_at: '2021-03-21 19:53:50',
      updated_at: '2021-03-21 19:53:50'
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('company_address', null, {});
  }
};
