'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Characteristic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Characteristic.hasMany(models.CharacteristicValue, {
        as: 'values',
        foreignKey: 'characteristicId'
      })
      Characteristic.hasMany(models.CharacteristicObject, {
        as: 'objects',
        foreignKey: 'characteristicId'
      })
      Characteristic.hasMany(models.CharacteristicSubCategory, {
        as: 'subcategories',
        foreignKey: 'characteristicId'
      })
      Characteristic.hasMany(models.AdCharacteristicSelect, {
        as: 'adCharacteristicSelects',
        foreignKey: 'characteristicId'
      })
      Characteristic.belongsTo(models.TypeCharacteristic, {
        as: 'types',
        foreignKey: 'typeCharacteristicId'
      })
      Characteristic.belongsTo(models.AdCharacteristicInput, {
        as: 'adCharacteristicInputs',
        foreignKey: 'characteristicId'
      })
    }
  }
  Characteristic.init({
    name: DataTypes.STRING,
    required: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Characteristic',
  });
  return Characteristic;
};
