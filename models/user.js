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
        foreignKey: 'userId'
      })
      User.hasMany(models.Booking, {
        foreignKey: 'userId'
      })
      User.hasMany(models.AdView, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Favorite, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Rating, {
        foreignKey: 'customerId'
      })
      User.hasMany(models.Rating, {
        foreignKey: 'sellerId'
      })
      User.hasMany(models.UserAvatar, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Appeal, {
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
    login: DataTypes.STRING,
    inn: DataTypes.STRING,
    isCompany: DataTypes.BOOLEAN,
    companyName: DataTypes.STRING,
    showPhone: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    name: {
      singular: 'user',
      plural: 'users'
    }
  });
  return User;
};
