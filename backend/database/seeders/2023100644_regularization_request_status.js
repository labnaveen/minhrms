
module.exports = {
    up: async (queryInterface) => {
        const data = [
            {
                name: 'Approved',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Pending',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Rejected',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];
      await queryInterface.bulkInsert('regularization_request_status', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('regularization_request_status', null, {});
    },
  };


