'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const SEED_SETTINGS = [{
      min_charge: 0,
      description: '',
      created_at: new Date(),
      updated_at: new Date()
    }]
    await queryInterface.bulkInsert('Settings', SEED_SETTINGS, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Settings', null, {})
  }
}
