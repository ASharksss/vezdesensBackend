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
        foreignKey: 'userId'
      })
      Ad.belongsTo(models.TypeAd, {
        foreignKey: 'typeAdId'
      })
      Ad.belongsTo(models.StatusAd, {
        foreignKey: 'statusAdId'
      })
      Ad.belongsTo(models.Objects, {
        foreignKey: 'objectId'
      })
      Ad.hasMany(models.ImageAd, {
        foreignKey: 'adId'
      })
      Ad.hasMany(models.PreviewImageAd, {
        foreignKey: 'adId'
      })
      Ad.hasMany(models.AdCharacteristicInput, {
        foreignKey: 'adId'
      })
      Ad.hasMany(models.CommercialImageAd, {
        foreignKey: 'adId'
      })
      Ad.hasMany(models.Booking, {
        foreignKey: 'adId'
      })
      Ad.hasMany(models.AdView, {
        foreignKey: 'adId'
      })
      Ad.hasMany(models.Favorite, {
        foreignKey: 'adId'
      })
      Ad.hasMany(models.AdCharacteristicSelect, {
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
    tableName: 'ads',
    modelName: 'Ad',
    name: {
      singular: 'ad',
      plural: 'ads'
    }
  });
  return Ad;
};
