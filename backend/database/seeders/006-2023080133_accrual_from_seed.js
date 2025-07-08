
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Parallel',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Sequential',
            created_at: new Date(),
            updated_at: new Date(),
        },
        ];
      await queryInterface.bulkInsert('approval_flow_type', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('approval_flow_type', null, {});
    },
  };


