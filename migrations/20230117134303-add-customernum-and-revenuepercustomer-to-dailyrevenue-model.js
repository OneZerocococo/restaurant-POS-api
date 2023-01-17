'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Daily_revenues', 'customer_num', {
      type: Sequelize.INTEGER,
      after: 'revenue'
    })
    await queryInterface.addColumn('Daily_revenues', 'revenue_per_customer', {
      type: Sequelize.DECIMAL(10, 2),
      after: 'customer_num'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Daily_revenues', 'customer_num')
    await queryInterface.removeColumn('Daily_revenues', 'revenue_per_customer')
  }
}
