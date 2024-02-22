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
        foreignKey: 'objectId'
      })
      Objects.hasMany(models.CharacteristicObject, {
        foreignKey: 'objectId'
      })
      Objects.belongsTo(models.SubCategory, {
        foreignKey: 'subCategoryId'
      })
      // define association here
    }
  }
  Objects.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'objects',
    modelName: 'Objects',
    name: {
      singular: 'object',
      plural: 'objects'
    }
  });
  return Objects;
};
