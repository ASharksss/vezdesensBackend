const sequelize = require('./db')
const {DataTypes, INTEGER} = require('sequelize')

const Ad = sequelize.define('ad', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  price: {type: DataTypes.INTEGER, allowNull: false},
  description: {type: DataTypes.STRING(5000), allowNull: false},
  address: {type: DataTypes.STRING, allowNull: false},
  longevity: {type: DataTypes.INTEGER, defaultValue: 30},
  views: {type: DataTypes.INTEGER, defaultValue: 0},
  dateEndActive: {type: DataTypes.DATE}
})

const TypeAd = sequelize.define('typeAd', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  size: {type: DataTypes.STRING},
  price: {type: DataTypes.INTEGER}
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

const Booking = sequelize.define('booking', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  dateStart: {type: DataTypes.DATE, allowNull: false},
  dateEnd: {type: DataTypes.DATE, allowNull: false},
  cost: {type: DataTypes.INTEGER},
  isActive: {type: DataTypes.BOOLEAN, defaultValue: true}
})

const Characteristic = sequelize.define('characteristic', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const CharacteristicValue = sequelize.define('characteristicValue', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true},
  name: {type: DataTypes.STRING}
})

const CharacteristicObject = sequelize.define('characteristicObject', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true}
})

const CharacteristicSubCategory = sequelize.define('characteristicSubCategory', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true}
})

const AdView = sequelize.define('adView', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Favorite = sequelize.define('favorite', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  email: {type: DataTypes.STRING},
  phone: {type: DataTypes.STRING},
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

//Бронирование типов объявления
Ad.hasMany(Booking)
Booking.belongsTo(Ad)

User.hasMany(Booking)
Booking.belongsTo(User)

TypeAd.hasMany(Booking)
Booking.belongsTo(TypeAd)

//Категории
SubCategory.hasMany(Objects)
Objects.belongsTo(SubCategory)

Category.hasMany(SubCategory)
SubCategory.belongsTo(Category)

//Характеристики
Characteristic.hasMany(CharacteristicValue)
CharacteristicValue.belongsTo(Characteristic)

Characteristic.hasMany(CharacteristicObject)
CharacteristicObject.belongsTo(Characteristic)

Characteristic.hasMany(CharacteristicSubCategory)
CharacteristicSubCategory.belongsTo(Characteristic)


Objects.hasMany(CharacteristicObject)
CharacteristicObject.belongsTo(Objects)

SubCategory.hasMany(CharacteristicSubCategory)
CharacteristicSubCategory.belongsTo(SubCategory)


//Просмотры
Ad.hasMany(AdView)
AdView.belongsTo(Ad)

User.hasMany(AdView)
AdView.belongsTo(User)

//Избранное
Ad.hasMany(Favorite)
Favorite.belongsTo(Ad)

User.hasMany(Favorite)
Favorite.belongsTo(User)

//Чат
Ad.hasMany(Chat)
Chat.belongsTo(Ad)

User.hasMany(Chat)
Chat.belongsTo(User)

Chat.hasMany(UserChat)
UserChat.belongsTo(Chat)

module.exports = {
  CharacteristicSubCategory, CharacteristicObject, Characteristic, CharacteristicValue, Favorite, AdView, Ad, TypeAd, StatusAd, Objects, Role, Category, SubCategory, User, Chat, Booking
}

