'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('company', [{
      company_name: 'Glocaliew',
      company_email: 'gvnoida@gmail.com',
      company_mobile: 9773914237,
      teamsize: 100,
      industry_id: 1,
      domain: 'glocalview',
      pan: 'UV2KRE6BTS',
      gst: '34CIPPS5925M1ZF',
      company_prefix: 'GV',
      is_deleted: false,
      created_at: '2023-03-23 16:00:00',
      updated_at: '2023-03-23 16:00:00'
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('company', null, {});
  }
};