'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Objects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Objects.hasMany(models.Ad, {
        as: 'ads',
        foreignKey: 'objectId'
      })
      Objects.hasMany(models.CharacteristicObject, {
        as: 'characteristicObject',
        foreignKey: 'objectId'
      })
      Objects.belongsTo(models.SubCategory, {
        as: 'subCategory',
        foreignKey: 'subCategoryId'
      })
      // define association here
    }
  }
  Objects.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Objects',
  });
  return Objects;
};
