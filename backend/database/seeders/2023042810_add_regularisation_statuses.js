const entities = []
const now = new Date()

entities.push({name: 'absent', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'field visit', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'half day', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'half day', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'holiday', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'onduty', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'present', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'weekly off', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'work from home', is_deleted: false, created_at: now, updated_at: now})


module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('regularisation_status', entities)
    },
    down: async(queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('regularisation_status', {
            name: { [Sequelize.Op.in]: entities.map(entity => entity.name)}
        })
    }
}