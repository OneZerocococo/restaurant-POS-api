'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'name_en', { type: Sequelize.TEXT })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'name_en', { type: Sequelize.STRING })
  }
}
