'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Bookings";

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert(options, [
        {
          userId: 2,
          spotId: 1,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
          createdAt: "2021-11-19 20:39:36",
          updatedAt: "2021-11-19 20:39:36"
        },
        {
          userId: 1,
          spotId: 2,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
          createdAt: "2021-11-19 20:39:36",
          updatedAt: "2021-11-19 20:39:36"
        },
        {
          userId: 3,
          spotId: 3,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
          createdAt: "2021-11-19 20:39:36",
          updatedAt: "2021-11-19 20:39:36"
        },
    ], {});
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete(options, null, {});

  }
};
