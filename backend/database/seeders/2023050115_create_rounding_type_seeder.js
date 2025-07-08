
module.exports = {
    up: async (queryInterface) => {
        const data = [
        {
            name: 'Rounding To Nearest',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Rounding Up',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Rounding Down',
            created_at: new Date(),
            updated_at: new Date(),
        },


        ];
      await queryInterface.bulkInsert('rounding_type', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('rounding_type', null, {});
    },
  };


