'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const now = new Date();

    const [users] = await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Initial Seller',
          email: 'seller@example.com',
          password: hashedPassword,
          isActive: true,
          createdAt: now,
          updatedAt: now
        }
      ],
      {
        returning: true
      }
    );

    await queryInterface.bulkInsert('Houses', [
      {
        address: '101 Cedar Street',
        price: 145000.0,
        status: 'available',
        sellerId: users.id,
        createdAt: now,
        updatedAt: now
      },
      {
        address: '202 Maple Avenue',
        price: 167500.0,
        status: 'sold',
        sellerId: users.id,
        createdAt: now,
        updatedAt: now
      },
      {
        address: '303 Oak Lane',
        price: 189900.0,
        status: 'available',
        sellerId: users.id,
        createdAt: now,
        updatedAt: now
      },
      {
        address: '404 Pine Road',
        price: 210000.0,
        status: 'sold',
        sellerId: users.id,
        createdAt: now,
        updatedAt: now
      },
      {
        address: '505 Birch Boulevard',
        price: 235000.0,
        status: 'available',
        sellerId: users.id,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Houses', {
      address: [
        '101 Cedar Street',
        '202 Maple Avenue',
        '303 Oak Lane',
        '404 Pine Road',
        '505 Birch Boulevard'
      ]
    });

    await queryInterface.bulkDelete('Users', {
      email: 'seller@example.com'
    });
  }
};