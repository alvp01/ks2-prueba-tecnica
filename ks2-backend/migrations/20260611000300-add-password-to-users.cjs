'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const fallbackPassword = await bcrypt.hash('changeMe123', 10);

    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.sequelize.query(
      'UPDATE "Users" SET "password" = :fallbackPassword WHERE "password" IS NULL',
      {
        replacements: { fallbackPassword }
      }
    );

    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'password');
  }
};