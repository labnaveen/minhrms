
module.exports = {
    up: async (queryInterface) => {
        const data = [
            {
                name: 'Graduation',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Post-graduation',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Diploma',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: '12th',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: '10th',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Certification',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];
      await queryInterface.bulkInsert('education_type', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('education_type', null, {});
    },
  };


