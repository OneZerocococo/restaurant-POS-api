'use strict'
const faker = require('faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const seedProducts = Array.from({ length: 10 }, (_, i) => ({
      name: `餐點${i + 1}`,
      name_en: `Product${i + 1}`,
      description: faker.lorem.paragraph().substring(0, 20),
      image: `https://loremflickr.com/320/240/meal/?lock=${i + 1}`,
      cost: 150,
      price: 300,
      created_at: new Date(),
      updated_at: new Date()
    }))
    await queryInterface.bulkInsert('Products', seedProducts, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
