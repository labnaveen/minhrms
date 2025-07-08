
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Pending',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            name: 'Approve',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Reject',
            created_at: new Date(),
            updated_at: new Date(),
        },

        ];
      await queryInterface.bulkInsert('approval_status', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('approval_status', null, {});
    },
  };


