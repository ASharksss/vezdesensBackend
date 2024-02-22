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
        as: 'characteristic',
        foreignKey: 'characteristicId'
      })
      CharacteristicValue.hasMany(models.AdCharacteristicSelect, {
        as: 'adCharacteristicSelect',
        foreignKey: 'characteristicValueId'
      })
      // define association here
    }
  }
  CharacteristicValue.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CharacteristicValue',
  });
  return CharacteristicValue;
};
