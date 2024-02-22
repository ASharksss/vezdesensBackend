'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Favorite.belongsTo(models.Ad, {
        foreignKey: 'adId'
      })
      Favorite.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      // define association here
    }
  }
  Favorite.init({
    value: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'favorites',
    modelName: 'Favorite',
    name: {
      singular: 'favorite',
      plural: 'favorites'
    }
  });
  return Favorite;
};
