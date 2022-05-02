'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requestComands', {
      id:{
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
      },
      userId:{
        type:Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      comandId:{
        type:Sequelize.INTEGER,
        references: {
          model: 'comands',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('requestComands');
  }
};