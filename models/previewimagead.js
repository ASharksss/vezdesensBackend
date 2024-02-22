'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PreviewImageAd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PreviewImageAd.belongsTo(models.Ad, {
        foreignKey: 'adId'
      })
      // define association here
    }
  }
  PreviewImageAd.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'previewImageAds',
    modelName: 'PreviewImageAd',
    name: {
      singular: 'previewImageAd',
      plural: 'previewImageAds'
    }
  });
  return PreviewImageAd;
};
