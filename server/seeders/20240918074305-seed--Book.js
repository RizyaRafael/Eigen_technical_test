'use strict';
let data = require('../data/books.json')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let books = data.map((book) => {
      book.createdAt = book.updatedAt = new Date()
      return book
    })
    await queryInterface.bulkInsert('Books', books, {})

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', books, {})

  }
};
