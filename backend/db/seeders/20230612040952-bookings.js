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
          userBooking: 2,
          spotBooking: 1,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
          createdAt: "2021-11-19 20:39:36",
          updatedAt: "2021-11-19 20:39:36"
        },
        {
          userBooking: 1,
          spotBooking: 2,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
          createdAt: "2021-11-19 20:39:36",
          updatedAt: "2021-11-19 20:39:36"
        },
        {
          userBooking: 3,
          spotBooking: 3,
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
