'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PositionRegion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PositionRegion.belongsTo(models.PositionDistrict, {
        as: 'districts',
        foreignKey: 'positionDistrictId'
      })
      PositionRegion.hasMany(models.PositionCity, {
        as: 'cities',
        foreignKey: 'positionRegionId'
      })
      // define association here
    }
  }
  PositionRegion.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PositionRegion',
  });
  return PositionRegion;
};
