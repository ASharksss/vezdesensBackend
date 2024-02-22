'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageAd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ImageAd.belongsTo(models.Ad, {
        foreignKey: 'adId'
      })
      // define association here
    }
  }
  ImageAd.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'imageAds',
    modelName: 'ImageAd',
    name: {
      singular: 'imageAd',
      plural: 'imageAds'
    }
  });
  return ImageAd;
};
