'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [{
      name: 'HR',
      alias: 'HR',
      description: 'This role is for the HR',
      status: 1,
      is_system_generated: true,
      created_at: '2023-03-23 19:53:50',
      updated_at: '2023-03-23 19:53:50'
    }], {});
    await queryInterface.bulkInsert('roles', [{
        name: 'Supervisor',
        alias: 'supervisor',
        description: 'This role is for the Managers/Supervisors',
        status: 1,
        is_system_generated: true,
        created_at: '2023-03-23 19:53:50',
        updated_at: '2023-03-23 19:53:50'
      }], {});
      await queryInterface.bulkInsert('roles', [{
        name: 'Employee',
        alias: 'employee',
        description: 'This role is for the employees',
        status: 1,
        is_system_generated: true,
        created_at: '2023-03-23 19:53:50',
        updated_at: '2023-03-23 19:53:50'
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
