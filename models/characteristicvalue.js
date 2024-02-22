'use strict';
const {
  Model
} = require('sequelize');
const {CharacteristicValue} = require("../models");
module.exports = (sequelize, DataTypes) => {
  class CharacteristicValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CharacteristicValue.belongsTo(models.Characteristic, {
        foreignKey: 'characteristicId'
      })
      CharacteristicValue.hasMany(models.AdCharacteristicSelect, {
        foreignKey: 'characteristicValueId'
      })
      // define association here
    }
  }
  CharacteristicValue.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'characteristicValues',
    modelName: 'CharacteristicValue',
    name: {
      singular: 'characteristicValue',
      plural: 'characteristicValues'
    }
  });
  return CharacteristicValue;
};
