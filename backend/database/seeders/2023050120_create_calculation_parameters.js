
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Fixed',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Percentage',
            created_at: new Date(),
            updated_at: new Date(),
        },

        ];
      await queryInterface.bulkInsert('calculation_parameters', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('calculation_parameters', null, {});
    },
  };


