'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdView extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AdView.belongsTo(models.Ad, {
        as: 'ads',
        foreignKey: 'adId'
      })
      AdView.belongsTo(models.User, {
        as: 'users',
        foreignKey: 'userId'
      })
      // define association here
    }
  }
  AdView.init({
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AdView',
  });
  return AdView;
};
