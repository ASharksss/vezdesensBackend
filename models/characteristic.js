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
        foreignKey: 'characteristicId'
      })
      Characteristic.hasMany(models.CharacteristicObject, {
        foreignKey: 'characteristicId'
      })
      Characteristic.hasMany(models.CharacteristicSubCategory, {
        foreignKey: 'characteristicId'
      })
      Characteristic.hasMany(models.AdCharacteristicSelect, {
        foreignKey: 'characteristicId'
      })
      Characteristic.belongsTo(models.TypeCharacteristic, {
        foreignKey: 'typeCharacteristicId'
      })
      Characteristic.hasMany(models.AdCharacteristicInput, {
        foreignKey: 'characteristicId'
      })
    }
  }
  Characteristic.init({
    name: DataTypes.STRING,
    required: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'characteristics',
    modelName: 'Characteristic',
    name: {
      singular: 'characteristic',
      plural: 'characteristics'
    }
  });
  return Characteristic;
};
