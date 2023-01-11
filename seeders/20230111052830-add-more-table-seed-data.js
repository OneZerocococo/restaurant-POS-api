'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tables',
      Array.from({ length: 15 }).map((_, i) =>
        ({
          name: `${i + 11}`,
          created_at: new Date(),
          updated_at: new Date()
        })
      ), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tables', null, {})
  }
}
