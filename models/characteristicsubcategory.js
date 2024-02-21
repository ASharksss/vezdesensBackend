'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CharacteristicSubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CharacteristicSubCategory.hasMany(models.Characteristic, {
        as: 'characteristically',
        foreignKey: 'characteristicId'
      })
      CharacteristicSubCategory.hasMany(models.SubCategory, {
        as: 'subcategories',
        foreignKey: 'subCategoryId'
      })
      // define association here
    }
  }
  CharacteristicSubCategory.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CharacteristicSubCategory',
  });
  return CharacteristicSubCategory;
};
