'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TopicOfAppeal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TopicOfAppeal.hasMany(models.Appeal, {
        foreignKey: 'topicOfAppealId'
      })
      // define association here
    }
  }
  TopicOfAppeal.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'topicOfAppeals',
    modelName: 'TopicOfAppeal',
    name: {
      singular: 'topicOfAppeal',
      plural: 'topicOfAppeals'
    }
  });
  return TopicOfAppeal;
};
