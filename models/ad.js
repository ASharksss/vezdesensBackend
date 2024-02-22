'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ad.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId'
      })
      Ad.belongsTo(models.TypeAd, {
        as: 'typeAd',
        foreignKey: 'typeAdId'
      })
      Ad.belongsTo(models.StatusAd, {
        as: 'statusAd',
        foreignKey: 'statusAdId'
      })
      Ad.belongsTo(models.Objects, {
        as: 'object',
        foreignKey: 'objectId'
      })
      Ad.hasMany(models.ImageAd, {
        as: 'imageAds',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.PreviewImageAd, {
        as: 'previewImageAds',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.AdCharacteristicInput, {
        as: 'adCharacteristicInputs',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.CommercialImageAd, {
        as: 'commercialImageAds',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.Booking, {
        foreignKey: 'adId'
      })
      Ad.hasMany(models.AdView, {
        foreignKey: 'adId'
      })
      Ad.hasMany(models.Favorite, {
        as: 'favorites',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.AdCharacteristicSelect, {
        as: 'adCharacteristicSelects',
        foreignKey: 'adId'
      })
      // define association here
    }
  }
  Ad.init({
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING(5000),
    address: DataTypes.STRING,
    views: DataTypes.INTEGER,
    showPhone: DataTypes.INTEGER,
    dateEndActive: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Ad',
  });
  return Ad;
};
