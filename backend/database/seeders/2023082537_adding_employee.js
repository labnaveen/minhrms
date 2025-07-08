'use strict';

module.exports = {
  up: async(queryInterface) => {
    await queryInterface.bulkInsert('user', [{
      company_id: 1,
      employee_name: 'Shikha Shukla',
      employee_generated_id:'GV-03',
      date_of_joining:'2023-08-25',
      // designation: 'Software Engineer',
      employee_official_email: 'shikha.shukla@glocalview.com',
      phone: '7584758439',
      dob_adhaar: '1998-03-03',
      dob_celebrated: '1998-03-03',
      employee_gender_id: 1,
      employee_personal_email: 'shikhashukla@gmail.com',
      role_id: 3,
      employee_password:'$2a$10$zlrETii0yY5VGTQh8wz8pOns7QkJbK5jqh42mnZpXVEbOCHiPEccC',
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