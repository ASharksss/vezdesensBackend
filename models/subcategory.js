'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SubCategory.belongsTo(models.Category, {
        as: 'categories',
        foreignKey: 'categoryId'
      })
      SubCategory.hasMany(models.Objects, {
        as: 'objects',
        foreignKey: 'subCategoryId'
      })
      SubCategory.hasMany(models.CharacteristicObject, {
        as: 'objects',
        foreignKey: 'subCategoryId'
      })
      // define association here
    }
  }
  SubCategory.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SubCategory',
  });
  return SubCategory;
};
