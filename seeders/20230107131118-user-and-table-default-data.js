'use strict'
const bcrypt = require('bcryptjs')
const SEED_USER = {
  account: 'admin',
  password: '12345678'
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      account: SEED_USER.account,
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10), null),
      created_at: new Date(),
      updated_at: new Date()
    }], {})
    await queryInterface.bulkInsert('Tables',
      Array.from({ length: 10 }).map((_, i) =>
        ({
          name: `${i + 1}`,
          created_at: new Date(),
          updated_at: new Date()
        })
      ), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Tables', null, {})
  }
}
