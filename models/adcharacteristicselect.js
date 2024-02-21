'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdCharacteristicSelect extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AdCharacteristicSelect.belongsTo(models.Ad, {
        as: 'ads',
        foreignKey: 'adId'
      })
      AdCharacteristicSelect.belongsTo(models.Characteristic, {
        as: 'characteristics',
        foreignKey: 'characteristicId'
      })
      AdCharacteristicSelect.belongsTo(models.CharacteristicValue, {
        as: 'characteristicValues',
        foreignKey: 'characteristicValueId'
      })
      // define association here
    }
  }
  AdCharacteristicSelect.init({
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AdCharacteristicSelect',
  });
  return AdCharacteristicSelect;
};
