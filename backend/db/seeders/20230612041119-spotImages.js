'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "SpotImages";

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert(options, [
      {
        spot_id: 1,
        url: 'image url',
        preview: true,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      {
        spot_id: 2,
        url: 'image url',
        preview: true,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      {
        spot_id: 3,
        url: 'image url',
        preview: true,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
  ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete(options, null, {});

  }
};
