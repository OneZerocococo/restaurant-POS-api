'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Settings', 'mincharge', 'min_charge', { type: Sequelize.INTEGER })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Settings', 'min_charge', 'mincharge', { type: Sequelize.INTEGER })
  }
}
