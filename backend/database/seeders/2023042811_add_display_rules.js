const entities = []

const now = new Date()

entities.push({name: 'overtime hours', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'deficit hours', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'late mark', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'average working hour', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'present no. of days', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'absent no. of days', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'no. of leaves taken', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'average in time', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'average out time', is_deleted: false, created_at: now, updated_at: now})



module.exports = {
    up: async(queryInterface, Sequelize) =>{
        return queryInterface.bulkInsert('display_rules', entities)
    },
    down: async(queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('display_rules', {
            name: { [Sequelize.Op.in]: entities.map(entity => entity.name)}
        })
    }
}