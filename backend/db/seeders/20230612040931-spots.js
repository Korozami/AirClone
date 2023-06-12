'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Spots";

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        avgRating: 4.5,
        previewImage: "image url",
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      {
        ownerId: 2,
        address: "125 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created maybe",
        price: 123,
        avgRating: 4.5,
        previewImage: "image url",
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      },
      {
        ownerId: 3,
        address: "12599 Hidden Lane",
        city: "Super Hidden",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Maybe my place",
        description: "Place where I sleep and slack off",
        price: 999,
        avgRating: 4.9,
        previewImage: "image url",
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36"
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete(options, null, {});
  }
};
