'use strict';

let entities = []
const now = new Date();

entities.push({attendance_policy_id: 1, regularisation_status_id: 1, created_at: now, updated_at: now})
entities.push({attendance_policy_id: 1, regularisation_status_id: 3, created_at: now, updated_at: now})
entities.push({attendance_policy_id: 1, regularisation_status_id: 7, created_at: now, updated_at: now})


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('regularisation_status_attendance_policy', entities)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('regularisation_status_attendance_policy', {
        name: { [Sequelize.Op.in]: entities.map(entity => entity.attendance_policy_id) }
      }, {});
  }
};
