'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Ads', 'objectId',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Objects',
        key: 'id'
      }
    })
    await queryInterface.addColumn('ImageAds', 'adId',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Ads',
        key: 'id'
      }
    })
    await queryInterface.addColumn('PreviewImageAds', 'adId',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Ads',
        key: 'id'
      }
    })
    await queryInterface.addColumn('CommercialImageAds', 'adId',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Ads',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Bookings', 'adId',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Ads',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Bookings', 'userId',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Bookings', 'typeAdId',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'TypeAds',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Objects', 'subCategoryId',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'SubCategories',
        key: 'id'
      }
    })
    await queryInterface.addColumn('SubCategories', 'categoryId',{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
    await queryInterface.addColumn('CharacteristicValues', 'characteristicId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Characteristics',
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
