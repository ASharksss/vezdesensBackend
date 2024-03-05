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
        as: 'writer',
        foreignKey: 'customerId'
      })
      Rating.belongsTo(models.User, {
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
    tableName: 'ratings',
    modelName: 'Rating',
    name: {
      singular: 'rating',
      plural: 'ratings'
    }
  });
  return Rating;
};
