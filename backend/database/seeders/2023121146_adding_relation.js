
module.exports = {
    up: async (queryInterface) => {
        const data = [
            {
                name: 'Spouse',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Father',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Mother',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Mother-in-law',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Father-in-law',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Sibling',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Child',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];
      await queryInterface.bulkInsert('relation', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('relation', null, {});
    },
  };


