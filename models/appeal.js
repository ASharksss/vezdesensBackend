'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appeal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appeal.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Appeal.belongsTo(models.TopicOfAppeal, {
        foreignKey: 'topicOfAppealId'
      })
      Appeal.belongsTo(models.StatusOfAppeal, {
        foreignKey: 'statusOfAppealId'
      })
      Appeal.hasMany(models.Message, {
        foreignKey: 'appealId'
      })
      // define association here
    }
  }
  Appeal.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'appeals',
    modelName: 'Appeal',
    name: {
      singular: 'appeal',
      plural: 'appeals'
    }
  });
  return Appeal;
};
