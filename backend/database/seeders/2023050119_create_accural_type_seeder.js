
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Beginning Of Cycle',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'End Of Cycle',
            created_at: new Date(),
            updated_at: new Date(),
        },

        ];
      await queryInterface.bulkInsert('accrual_type', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('accrual_type', null, {});
    },
  };


