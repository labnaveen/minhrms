
module.exports = {
    up: async (queryInterface) => {
      const data = [
        {
          name: 'Jan - Dec',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Apr - Mar',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Custom',
          created_at: new Date(),
          updated_at: new Date(),
        },

      ];
      await queryInterface.bulkInsert('leave_calendar_cycle', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('leave_calendar_cycle', null, {});
    },
  };


