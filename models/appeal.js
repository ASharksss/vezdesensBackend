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
        as: 'users',
        foreignKey: 'userId'
      })
      Appeal.belongsTo(models.TopicOfAppeal, {
        as: 'topics',
        foreignKey: 'topicOfAppealId'
      })
      Appeal.belongsTo(models.StatusOfAppeal, {
        as: 'status',
        foreignKey: 'statusOfAppealId'
      })
      Appeal.hasMany(models.Message, {
        as: 'messages',
        foreignKey: 'appealId'
      })
      // define association here
    }
  }
  Appeal.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Appeal',
  });
  return Appeal;
};
