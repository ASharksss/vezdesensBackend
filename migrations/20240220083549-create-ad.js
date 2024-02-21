'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      showPhone: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      dateEndActive: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      typeAdId: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: {
          model: 'TypeAds',
          key: 'id'
        }
      },
      statusAdId: {
        type: Sequelize.INTEGER,
        defaultValue: 2,
        allowNull: false,
        references: {
          model: 'StatusAds',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Ads');
  }
};
