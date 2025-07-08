
module.exports = {
    up: async (queryInterface) => {
      const data = [];
      for (let day = 1; day <= 28; day++) {
        const currentDate = new Date();

        data.push({
          day:day,
          created_at: currentDate,
          updated_at: currentDate,
        });

      }
      data.push({
        day:"Last Day",
        created_at: new Date(),
        updated_at: new Date(),
      });
      await queryInterface.bulkInsert('day_of_month', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('day_of_month', null, {});
    },
  };


