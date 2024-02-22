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
        as: 'ads',
        foreignKey: 'typeAdId'
      })
      TypeAd.hasMany(models.Booking, {
        as: 'bookings',
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
    modelName: 'TypeAd',
  });
  return TypeAd;
};
