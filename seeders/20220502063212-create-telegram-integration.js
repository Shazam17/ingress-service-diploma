'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('IntegrationTypes', [
      {
        id: 'd53f4e17-645c-47e4-80d6-70cf370b1492',
        name: 'TELEGRAM',
        url: 'http://localhost:3000',
        createdAt: '2022-05-02 03:36:00.710000 +00:00',
        updatedAt: '2022-05-02 03:36:00.710000 +00:00'
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
