'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Reviews";

module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.bulkInsert(options, [
      {
       user_id: 1,
       spotId: 1,
       review: 'This was an awesome spot!',
       stars: 5,
       createdAt: "2021-11-19 20:39:36",
       updatedAt: "2021-11-19 20:39:36"
     },
     {
      user_id: 2,
      spotId: 2,
      review: 'This was aight',
      stars: 3,
      createdAt: "2021-11-19 20:39:36",
      updatedAt: "2021-11-19 20:39:36"
    },
    {
      user_id: 3,
      spotId: 3,
      review: 'This is my spot and my spot only',
      stars: 5,
      createdAt: "2021-11-19 20:39:36",
      updatedAt: "2021-11-19 20:39:36"
    },
    ], {});
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete(options, null, {});
  }
};
