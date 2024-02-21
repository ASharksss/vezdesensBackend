'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Messages', 'parentId')
    await queryInterface.addColumn('Messages', 'parentId', {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
      references: {
        model: 'Messages',
        key: 'id'
      }
    })
  },

  async down (queryInterface) {
  }
};
