'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('division_units', [
        {
            unit_name: 'HR',
            division_id: 2,
            system_generated: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            unit_name: 'IT',
            division_id: 2,
            system_generated: true,
            created_at: new Date()
        },
        {
            unit_name: 'Marketing & Sales',
            division_id: 2,
            system_generated: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            unit_name: 'Finance',
            division_id: 2,
            system_generated: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            unit_name: 'Operations',
            division_id: 2,
            system_generated: true,
            created_at: new Date(),
            updated_at: new Date()
        }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('division_units', null, {});
  }
};
