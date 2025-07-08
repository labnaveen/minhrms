
module.exports = {
    up: async (queryInterface) => {
        const data = [
            {
                name: 'accepted',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'rejected',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'pending',
                created_at: new Date(),
                updated_at: new Date(),
            }
        ];
      await queryInterface.bulkInsert('letter_status', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('letter_status', null, {});
    },
  };


