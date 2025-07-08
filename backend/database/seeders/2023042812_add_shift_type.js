const entities = []
const now = new Date()

entities.push({name: 'start end time', is_deleted: false, created_at: now, updated_at: now})
entities.push({name: 'working hours', is_deleted: false, created_at: now, updated_at: now})



module.exports={
    up: async(queryInterface) => {
        await queryInterface.bulkInsert('shift_type', entities)
    },

    down: async(queryInterface) => {
        await queryInterface.bulkDelete('shift_type', {
            name: { [Sequelize.Op.in]: entities.map(entity => entity.name)}
        })
    }
}

