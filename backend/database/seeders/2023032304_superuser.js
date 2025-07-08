'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('user', [{
      company_id: 1,
      employee_name: 'Anugrah',
      employee_generated_id:'GV-01',
      date_of_joining:'2023-04-03',
      // designation: 'Software Engineer',
      // department: 1,
      phone: '9773914237',
      employee_official_email: 'anugrah.bhatt@glocalview.com',
      dob_adhaar: '1998-05-27',
      dob_celebrated: '1998-05-27',
      employee_gender_id: 1,
      employee_personal_email: 'bhattanugrah@gmail.com',
      role_id: 1,
      employee_password:'$2a$10$HqLJPb.z9vnFkFUsPXBVq.HDlXyOe/mrAehNkbrrIWBWkAKlTKWN2',
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