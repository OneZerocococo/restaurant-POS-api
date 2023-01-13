'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Sold_products', 'selling_price', { type: Sequelize.INTEGER, allowNull: false, after: 'count' })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Sold_products', 'selling_price')
  }
}
