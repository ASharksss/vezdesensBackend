'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StatusOfAppeal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StatusOfAppeal.hasMany(models.Appeal, {
        as: 'appeal',
        foreignKey: 'statusOfAppealId'
      })
      // define association here
    }
  }
  StatusOfAppeal.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StatusOfAppeal',
  });
  return StatusOfAppeal;
};
