'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'is_finished', {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      after: 'is_paid'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'is_finished')
  }
}
