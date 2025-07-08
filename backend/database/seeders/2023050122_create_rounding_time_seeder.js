
module.exports = {
    up: async (queryInterface) => {
      const data = [];
      for (let time = 10; time <= 60; time += 10) {
        const currentDate = new Date();

        data.push({
          time:time+" minutes",
          created_at: currentDate,
          updated_at: currentDate,
        });

      }

      await queryInterface.bulkInsert('rounding_time', data, {});
    },

    down: async (queryInterface) => {
      await queryInterface.bulkDelete('rounding_time', null, {});
    },
  };


