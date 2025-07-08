
module.exports = {
    up: async (queryInterface) => {
        const data = [
            {
                name: 'First Half',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Second Half',
                created_at: new Date(),
                updated_at: new Date(),
            }
        ];
      await queryInterface.bulkInsert('half_day_type', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('half_day_type', null, {});
    },
  };


