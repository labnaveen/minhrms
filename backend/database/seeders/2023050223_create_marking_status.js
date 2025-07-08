
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Late',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Absent',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Half-Day',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Present',
            created_at: new Date(),
            updated_at: new Date(),
        },

        ];
      await queryInterface.bulkInsert('marking_status', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('marking_status', null, {});
    },
  };


