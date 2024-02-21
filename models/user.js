'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Ad, {
        as: 'ads',
        foreignKey: 'userId'
      })
      User.hasMany(models.Booking, {
        as: 'bookings',
        foreignKey: 'userId'
      })
      User.hasMany(models.AdView, {
        as: 'adViews',
        foreignKey: 'userId'
      })
      User.hasMany(models.Favorite, {
        as: 'favorites',
        foreignKey: 'userId'
      })
      User.hasMany(models.Rating, {
        as: 'customerRatings',
        foreignKey: 'customerId'
      })
      User.hasMany(models.Rating, {
        as: 'sellerRatings',
        foreignKey: 'sellerId'
      })
      User.hasMany(models.UserAvatar, {
        as: 'avatars',
        foreignKey: 'userId'
      })
      User.hasMany(models.Appeal, {
        as: 'appeals',
        foreignKey: 'userId'
      })
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    login: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
