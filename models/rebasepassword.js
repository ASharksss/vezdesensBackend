'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RebasePassword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RebasePassword.init({
    email: DataTypes.STRING,
    code: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'rebasePasswords',
    modelName: 'RebasePassword',
    name: {
      singular: 'rebasePassword',
      plural: 'rebasePasswords'
    }
  });
  return RebasePassword;
};
