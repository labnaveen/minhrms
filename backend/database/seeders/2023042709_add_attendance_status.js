
const entities = []
const now  = new Date();

entities.push({name: 'absent', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'half day', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'present', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'weekday off', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'holiday', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'leave', is_deleted: false, created_at: now, updated_at: now})





module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('attendance_status', entities)
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('attendance_status', {
            name: { [Sequelize.Op.in]: entities.map(entity => entity.name)}
        })
    }
}