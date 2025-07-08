
module.exports = {
  up: async (queryInterface) => {
    const data = [
      {
        name: 'January',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'February',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'March',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'April',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'May',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'June',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'July',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'August',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'September',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'October',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'November',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'December',
        created_at: new Date(),
        updated_at: new Date(),
      },

    ];

    await queryInterface.bulkInsert('months', data, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('months', null, {});
  },
};


