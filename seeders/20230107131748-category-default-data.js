'use strict'
const SEED_CATEGORY = [
  {
    name: '未分類',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: '在地風味套餐',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: '義大利麵套餐',
    created_at: new Date(),
    updated_at: new Date()
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
      SEED_CATEGORY, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
