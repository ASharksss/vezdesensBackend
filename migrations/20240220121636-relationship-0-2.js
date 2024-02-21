'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('CharacteristicObjects', 'characteristicId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Characteristics',
        key: 'id'
      }
    })
    await queryInterface.addColumn('CharacteristicSubCategories', 'characteristicId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Characteristics',
        key: 'id'
      }
    })
    await queryInterface.addColumn('AdCharacteristicInputs', 'characteristicId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Characteristics',
        key: 'id'
      }
    })
    await queryInterface.addColumn('AdCharacteristicSelects', 'characteristicId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Characteristics',
        key: 'id'
      }
    })
    await queryInterface.addColumn('CharacteristicObjects', 'objectId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Objects',
        key: 'id'
      }
    })
    await queryInterface.addColumn('CharacteristicSubCategories', 'subCategoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'SubCategories',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Characteristics', 'typeCharacteristicId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'TypeCharacteristics',
        key: 'id'
      }
    })
    await queryInterface.addColumn('AdCharacteristicInputs', 'adId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Ads',
        key: 'id'
      }
    })
    await queryInterface.addColumn('AdCharacteristicSelects', 'adId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Ads',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Favorites', 'adId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Ads',
        key: 'id'
      }
    })
    await queryInterface.addColumn('AdViews', 'adId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Ads',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Favorites', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
    await queryInterface.addColumn('AdViews', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
    await queryInterface.addColumn('AdCharacteristicSelects', 'characteristicValueId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'CharacteristicValues',
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
