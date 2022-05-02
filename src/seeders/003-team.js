'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('comands', [
      { comandName:"111"},
      { comandName:"222"},
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comands', null, {});
  }
};
