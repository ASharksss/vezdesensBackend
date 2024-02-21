'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StaticAd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StaticAd.init({
    dateStart: DataTypes.DATE,
    dateEnd: DataTypes.DATE,
    imageName: DataTypes.STRING,
    href: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StaticAd',
  });
  return StaticAd;
};