'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAvatar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserAvatar.belongsTo(models.User, {
        as: 'users',
        foreignKey: 'userId'
      })
      // define association here
    }
  }
  UserAvatar.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserAvatar',
  });
  return UserAvatar;
};
