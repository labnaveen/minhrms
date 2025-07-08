
module.exports = {
    up: async (queryInterface) => {
        const data = [
            {
                name: 'Male',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Female',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Others',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];
      await queryInterface.bulkInsert('gender', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('gender', null, {});
    },
  };


