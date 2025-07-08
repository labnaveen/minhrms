
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Monthly',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Quaterly',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Half-yearly',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Yearly',
            created_at: new Date(),
            updated_at: new Date(),
        },

        ];
      await queryInterface.bulkInsert('accrual_frequency', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('accrual_frequency', null, {});
    },
  };


