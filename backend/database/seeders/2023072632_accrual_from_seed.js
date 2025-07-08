
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Date of Joining',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Date of Confirmation',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Custom date for Accural',
            created_at: new Date(),
            updated_at: new Date(),
        },
        ];
      await queryInterface.bulkInsert('accrual_from', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('accrual_from', null, {});
    },
  };


