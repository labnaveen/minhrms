
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Date Of Joining',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Date Of Confirmation',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Custom',
            created_at: new Date(),
            updated_at: new Date(),
        },


        ];
      await queryInterface.bulkInsert('job_milestones', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('job_milestones', null, {});
    },
  };


