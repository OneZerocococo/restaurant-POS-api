'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'is_closed', { type: Sequelize.BOOLEAN, after: 'is_finished', defaultValue: false })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'is_closed')
  }
}
