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
        as: 'images',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.PreviewImageAd, {
        as: 'previewImages',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.AdCharacteristicInput, {
        as: 'adCharacteristicInputs',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.CommercialImageAd, {
        as: 'commercialImages',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.Booking, {
        as: 'bookings',
        foreignKey: 'adId'
      })
      Ad.hasMany(models.AdView, {
        as: 'adViews',
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
