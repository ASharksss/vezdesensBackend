'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdCharacteristicInput extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AdCharacteristicInput.belongsTo(models.Ad, {
        as: 'ads',
        foreignKey: 'adId'
      })
      AdCharacteristicInput.belongsTo(models.Characteristic, {
        as: 'characteristics',
        foreignKey: 'characteristicId'
      })
      // define association here
    }
  }
  AdCharacteristicInput.init({
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AdCharacteristicInput',
  });
  return AdCharacteristicInput;
};
