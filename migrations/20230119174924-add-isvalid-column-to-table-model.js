'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Tables', 'is_valid', { type: Sequelize.BOOLEAN, after: 'name', defaultValue: true, allowNull: false })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tables', 'is_valid')
  }
}
