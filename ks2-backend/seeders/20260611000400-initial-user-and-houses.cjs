'use strict';

const bcrypt = require('bcrypt');

const userSeeds = [
  { name: 'Initial Seller', email: 'seller@example.com' },
  { name: 'Alice Morgan', email: 'alice@example.com' },
  { name: 'Bruno Silva', email: 'bruno@example.com' },
  { name: 'Carla Mendes', email: 'carla@example.com' },
  { name: 'Diego Ramos', email: 'diego@example.com' }
];

const streetNames = ['Cedar Street', 'Maple Avenue', 'Oak Lane', 'Pine Road', 'Birch Boulevard'];

const buildHousesForUser = (userIndex, sellerId, now) => {
  return streetNames.map((street, streetIndex) => ({
    address: `${100 * (streetIndex + 1) + userIndex} ${street}`,
    price: 145000 + userIndex * 12000 + streetIndex * 17500,
    status: streetIndex % 2 === 0 ? 'available' : 'sold',
    sellerId,
    createdAt: now,
    updatedAt: now
  }));
};

const buildHouseAddresses = () => {
  return userSeeds.flatMap((_, userIndex) =>
    streetNames.map((street, streetIndex) => `${100 * (streetIndex + 1) + userIndex} ${street}`)
  );
};

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const now = new Date();

    await queryInterface.bulkInsert(
      'Users',
      userSeeds.map((user) => ({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        isActive: true,
        createdAt: now,
        updatedAt: now
      })),
      { returning: true }
    );

    const [insertedUsers] = await queryInterface.sequelize.query(
      'SELECT "id", "email" FROM "Users" WHERE "email" IN (:emails)',
      {
        replacements: {
          emails: userSeeds.map((user) => user.email)
        }
      }
    );

    const userIdByEmail = new Map(insertedUsers.map((user) => [user.email, user.id]));

    const houses = userSeeds.flatMap((user, userIndex) => {
      const sellerId = userIdByEmail.get(user.email);

      if (!sellerId) {
        throw new Error(`Seed user id not found for ${user.email}`);
      }

      return buildHousesForUser(userIndex, sellerId, now);
    });

    await queryInterface.bulkInsert('Houses', houses);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Houses', {
      address: buildHouseAddresses()
    });

    await queryInterface.bulkDelete('Users', {
      email: userSeeds.map((user) => user.email)
    });
  }
};