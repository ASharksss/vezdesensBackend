'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeCharacteristic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TypeCharacteristic.hasMany(models.Characteristic, {
        foreignKey: 'typeCharacteristicId'
      })
      // define association here
    }
  }
  TypeCharacteristic.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'typeCharacteristics',
    modelName: 'TypeCharacteristic',
    name: {
      singular: 'typeCharacteristic',
      plural: 'typeCharacteristics'
    }
  });
  return TypeCharacteristic;
};
