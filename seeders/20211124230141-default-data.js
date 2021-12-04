'use strict';

require('dotenv').config()
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin1234', 10)
    
    await queryInterface.bulkInsert("users", [
      {
        fullName: "Doltons Edward Nic",
        email: "admin@literature.com",
        password: hashedPassword,
        gender: "Male",
        phone: "089619800459",
        address: "Jl. Musyawarah",
        avatar: process.env.PATH_AVATAR_DEFAULT,
        role: "admin",
        createdAt: "4 december 20021",
        updatedAt: "4 december 2021"
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
