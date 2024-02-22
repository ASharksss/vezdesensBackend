'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rating.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'customerId'
      })
      Rating.belongsTo(models.User, {
        as: 'ratings',
        foreignKey: 'sellerId'
      })
      // define association here
    }
  }
  Rating.init({
    grade: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};
