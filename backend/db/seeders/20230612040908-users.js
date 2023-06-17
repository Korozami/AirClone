'use strict';
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Users";

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(options, [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@gmail.com',
        username: 'JohnSmit',
        hashedPassword: bcrypt.hashSync('password1')

      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@gmail.com',
        username: 'JaneDoe',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Kevin',
        lastName: 'Sy',
        email: 'idk@gmail.com',
        username: 'ThisSoHard',
        hashedPassword: bcrypt.hashSync('secret')
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete(options, null, {});

  }
};
