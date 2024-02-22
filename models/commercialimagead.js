'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommercialImageAd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CommercialImageAd.belongsTo(models.Ad, {
        foreignKey: 'adId'
      })
      // define association here
    }
  }
  CommercialImageAd.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'commercialImageAds',
    modelName: 'CommercialImageAd',
    name: {
      singular: 'commercialImageAd',
      plural: 'commercialImageAds'
    }
  });
  return CommercialImageAd;
};
