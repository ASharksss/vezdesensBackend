'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Message.belongsTo(models.Appeal, {
                as: 'appeals',
                foreignKey: 'appealId'
            })
            Message.hasMany(models.Message, {
              as: 'children',
              foreignKey: 'parentId'
            });
            Message.belongsTo(models.Message, {
              as: 'parent',
              foreignKey: 'parentId'
            });
            // define association here
        }
    }

    Message.init({
        text: DataTypes.STRING,
        isSupport: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};
