'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PositionCity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PositionCity.belongsTo(models.PositionRegion, {
        as: 'regions',
        foreignKey: 'positionRegionId'
      })
      // define association here
    }
  }
  PositionCity.init({
    name: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    citySlug: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PositionCity',
  });
  return PositionCity;
};
