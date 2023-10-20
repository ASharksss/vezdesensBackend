const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const Ad = sequelize.define('ad', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  price: {type: DataTypes.INTEGER, allowNull: false},
  description: {type: DataTypes.STRING(5000), allowNull: false},
  address: {type: DataTypes.STRING, allowNull: false},
  longevity: {type: DataTypes.INTEGER, defaultValue: 30},
  views: {type: DataTypes.INTEGER, defaultValue: 0}
})

const TypeAd = sequelize.define('typeAd', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  size: {type: DataTypes.STRING},
  price: {type: DataTypes.DECIMAL}
})

const StatusAd = sequelize.define('statusAd', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const Category = sequelize.define('category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const SubCategory = sequelize.define('subCategory', {
  id: {type: DataTypes.UUID, primaryKey: true}, name: {type: DataTypes.STRING}
})

const Objects = sequelize.define('objects', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  email: {type: DataTypes.STRING, unique: true},
  phone: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING, allowNull: false},
  login: {type: DataTypes.STRING, allowNull: false}
})

const Role = sequelize.define('role', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
})

const Chat = sequelize.define('chat', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const UserChat = sequelize.define('userChat', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

//Relationships

//Объявления
User.hasMany(Ad)
Ad.belongsTo(User)

TypeAd.hasMany(Ad, {
  foreignKey: {
    defaultValue: 1,
    allowNull: false
  }
})
Ad.belongsTo(TypeAd)

StatusAd.hasMany(Ad, {
  foreignKey: {
    defaultValue: 2
  }
})
Ad.belongsTo(StatusAd)

Objects.hasMany(Ad)
Ad.belongsTo(Objects)


//Категории
SubCategory.hasMany(Objects)
Objects.belongsTo(SubCategory)

Category.hasMany(SubCategory)
SubCategory.belongsTo(Category)

//Чат
Ad.hasMany(Chat)
Chat.belongsTo(Ad)

User.hasMany(Chat)
Chat.belongsTo(User)

Chat.hasMany(UserChat)
UserChat.belongsTo(Chat)

module.exports = {
  Ad, TypeAd, StatusAd, Objects, Role, Category, SubCategory, User, Chat
}

