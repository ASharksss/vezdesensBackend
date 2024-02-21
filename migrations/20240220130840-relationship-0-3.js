'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Ratings', 'customerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Ratings', 'sellerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
    await queryInterface.addColumn('UserAvatars', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
    await queryInterface.addColumn('PositionCities', 'positionRegionId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'PositionRegions',
        key: 'id'
      }
    })
    await queryInterface.addColumn('PositionRegions', 'positionDistrictId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'PositionDistricts',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Appeals', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Appeals', 'statusOfAppealId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'StatusOfAppeals',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Appeals', 'topicOfAppealId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'TopicOfAppeals',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Messages', 'isSupport', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
    await queryInterface.addColumn('Messages', 'appealId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Appeals',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Messages', 'parentId', {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
      references: {
        model: 'Messages',
        key: 'id'
      }
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
