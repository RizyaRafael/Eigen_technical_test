'use strict';
let data = require('../data/members.json');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let members = data.map((member => {
      member.createdAt = member.updatedAt = new Date()
      return member
    }))
    await queryInterface.bulkInsert('Members', members, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Members', members, {})

  }
};
