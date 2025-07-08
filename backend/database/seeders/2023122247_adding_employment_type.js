
module.exports = {
    up: async (queryInterface) => {
        const data = [
            {
                name: 'Full-time',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Part-time',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Contractual',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Commission-based',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Traineeship',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Probation',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Internship',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];
      await queryInterface.bulkInsert('employment_type', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('employment_type', null, {});
    },
  };


