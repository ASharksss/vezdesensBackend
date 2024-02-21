'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StatusAd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StatusAd.hasMany(models.Ad, {
        as: 'ads',
        foreignKey: 'statusAdId'
      })
    }
  }
  StatusAd.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StatusAd',
  });
  return StatusAd;
};
