
module.exports = {
    up: async (queryInterface) => {
      const data = [
        {
          name: 'Monday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Tuesday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Wednesday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Thursday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Friday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Saturday',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
            name: 'Sunday',
            created_at: new Date(),
            updated_at: new Date(),
        },

      ];

      await queryInterface.bulkInsert('week', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('week', null, {});
    },
  };


