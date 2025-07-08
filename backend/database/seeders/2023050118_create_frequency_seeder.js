
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Daily',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Weekly',
            created_at: new Date(),
            updated_at: new Date(),
        },
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
            name: 'Half-Yearly',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Anually',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Custom',
            created_at: new Date(),
            updated_at: new Date(),
        },


        ];
      await queryInterface.bulkInsert('frequency', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('frequency', null, {});
    },
  };


