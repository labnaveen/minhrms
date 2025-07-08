'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('user', [{
      company_id: 1,
      employee_name: 'Vikram Singh',
      employee_generated_id:'GV-02',
      date_of_joining:'2023-08-25',
      // designation: 'Delivery Manager',
      employee_official_email: 'vikram.singh@glocalview.com',
      phone: '8787382309',
      dob_adhaar: '1994-02-02',
      dob_celebrated: '1994-02-02',
      employee_gender_id: 1,
      employee_personal_email: 'vikramsingh@gmail.com',
      role_id: 2,
      employee_password:'$2a$10$SVa70bcShZkOM.rrA40yiervvqRdNmhlDQbA.UyjxzuxyM2w19IA.',
      is_deleted: false,
      master_policy_id: 1,
      created_at: '2023-03-23 16:00:00',
      updated_at: '2023-03-23 16:00:00'
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('user', null, {});
  },

  order:3
};