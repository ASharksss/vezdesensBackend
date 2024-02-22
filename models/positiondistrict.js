'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PositionDistrict extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PositionDistrict.hasMany(models.PositionRegion, {
        foreignKey: 'positionDistrictId'
      })
      // define association here
    }
  }
  PositionDistrict.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'positionDistricts',
    modelName: 'PositionDistrict',
    name: {
      singular: 'positionDistrict',
      plural: 'positionDistricts'
    }
  });
  return PositionDistrict;
};
