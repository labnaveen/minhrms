'use strict';

module.exports = {
  up: async(queryInterface) => {
    await queryInterface.bulkInsert('user', [{
      company_id: 1,
      employee_name: 'Vimal Gupta',
      employee_generated_id:'GV-04',
      date_of_joining:'2023-08-25',
      // designation: 'Software Engineer',
      employee_official_email: 'vimal.gupta@glocalview.com',
      phone: '7584758439',
      dob_adhaar: '1998-03-03',
      dob_celebrated: '1998-03-03',
      employee_gender_id: 1,
      employee_personal_email: 'vimalgupta@gmail.com',
      role_id: 2,
      employee_password:'$2a$10$.yag1hfY3qf58zpTkv737OV5v/M0hka2XFtbZsCxrI5ISFXr1IMfW',
      is_deleted: false,
      master_policy_id: 1,
      created_at: '2023-03-23 16:00:00',
      updated_at: '2023-03-23 16:00:00'
    }], {});

    await queryInterface.bulkInsert('user', [{
        company_id: 1,
        employee_name: 'Harshit Sharma',
        employee_generated_id:'GV-05',
        date_of_joining:'2023-08-25',
        // designation: 'Software Engineer',
        employee_official_email: 'harshit.sharma@glocalview.com',
        phone: '7584758439',
        dob_adhaar: '1998-03-03',
        dob_celebrated: '1998-03-03',
        employee_gender_id: 1,
        employee_personal_email: 'harshit@gmail.com',
        role_id: 2,
        employee_password:'$2a$10$7b3eWLnnoj8N1SFhvCkdrO7ysDO/XUoSv0KCyPd4a6padmyGjyAaW',
        is_deleted: false,
        master_policy_id: 1,
        created_at: '2023-03-23 16:00:00',
        updated_at: '2023-03-23 16:00:00'
      }], {});

  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('user', null, {});
  },

  order:4
};