'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeAd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TypeAd.hasMany(models.Ad, {
        foreignKey: 'typeAdId'
      })
      TypeAd.hasMany(models.Booking, {
        foreignKey: 'typeAdId'
      })
      // define association here
    }
  }
  TypeAd.init({
    name: DataTypes.STRING,
    size: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'typeAds',
    modelName: 'TypeAd',
    name: {
      singular: 'typeAd',
      plural: 'typeAds'
    }
  });
  return TypeAd;
};
