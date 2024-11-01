'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CharacteristicObject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CharacteristicObject.belongsTo(models.Characteristic, {
        foreignKey: 'characteristicId'
      })
      CharacteristicObject.belongsTo(models.Objects, {
        foreignKey: 'objectId'
      })
      // define association here
    }
  }
  CharacteristicObject.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'characteristicObjects',
    modelName: 'CharacteristicObject',
    name: {
      singular: 'characteristicObjects',
      plural: 'characteristicObject'
    }
  });
  return CharacteristicObject;
};
