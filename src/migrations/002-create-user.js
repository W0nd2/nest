'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id:{
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
      },    
      email:                                  // для отправки писем для востановления пароля
        {type: Sequelize.STRING,
        unique: true
      },                           
      login:{
        type: Sequelize.STRING,
        allowNull: false
      },                     
      password:{
        type: Sequelize.STRING, 
        allowNull: true
      },                     
      avatar:{
        type: Sequelize.STRING
      },
      roleId:{                                // роль на сайте
        type: Sequelize.INTEGER, 
        defaultValue:1,
        references: {
          model: 'roles',
          key: 'id'
        }
      },                      
      accountType:{
        type: Sequelize.STRING, 
        defaultValue:"common"
      },
      managerActive:{                         // активен ли аккаунт менеджера или нет
        type: Sequelize.BOOLEAN, 
        defaultValue:"false"
      }                                
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};