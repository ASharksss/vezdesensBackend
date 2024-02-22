'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Ad, {
        as: 'ad',
        foreignKey: 'adId'
      })
      Booking.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId'
      })
      Booking.belongsTo(models.TypeAd, {
        as: 'typeAd',
        foreignKey: 'typeAdId'
      })

      // define association here
    }
  }
  Booking.init({
    dateStart: DataTypes.DATE,
    dateEnd: DataTypes.DATE,
    cost: DataTypes.INTEGER,
    position: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
