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
  showPhone: {type: DataTypes.INTEGER, defaultValue: 0},
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
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const ImageAd = sequelize.define('imageAd', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const PreviewImageAd = sequelize.define('previewImageAd', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const CommercialImageAd = sequelize.define('commercialImageAd', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const UserAvatar = sequelize.define('userAvatar', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
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
  position: {type: DataTypes.STRING},
  isActive: {type: DataTypes.BOOLEAN, defaultValue: true}
})

const Characteristic = sequelize.define('characteristic', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  required: {type: DataTypes.BOOLEAN}
})

const TypeCharacteristic = sequelize.define('typeCharacteristic', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true}
})

const CharacteristicValue = sequelize.define('characteristicValue', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const CharacteristicObject = sequelize.define('characteristicObject', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const CharacteristicSubCategory = sequelize.define('characteristicSubCategory', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const AdCharacteristicInput = sequelize.define('adCharacteristicInput', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  value: {type: DataTypes.STRING}
})

const AdCharacteristicSelect = sequelize.define('adCharacteristicSelect', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
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

const Rating = sequelize.define('rating', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  customerId: {type: DataTypes.INTEGER, allowNull: false, foreignKey: true},
  sellerId: {type: DataTypes.INTEGER, allowNull: false, foreignKey: true},
  grade: {type: DataTypes.INTEGER, allowNull: false},
  text: {type: DataTypes.STRING, allowNull: false}
})

const Chat = sequelize.define('chat', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const UserChat = sequelize.define('userChat', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const PositionDistrict = sequelize.define('positionDistrict', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false}
})
const PositionRegion = sequelize.define('positionRegion', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false}
})
const PositionCity = sequelize.define('positionCity', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  latitude: {type: DataTypes.FLOAT, allowNull: true},
  longitude: {type: DataTypes.FLOAT, allowNull: true},
  name: {type: DataTypes.STRING, allowNull: false},
  citySlug: {type: DataTypes.STRING, allowNull: false}
})

const StaticAd = sequelize.define('staticAd', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  dateStart: {type: DataTypes.DATE, allowNull: false},
  dateEnd: {type: DataTypes.DATE, allowNull: false},
  imageName: {type: DataTypes.STRING, allowNull: false},
  href: {type: DataTypes.STRING, allowNull: false}
})

//Support

const TopicOfAppeal = sequelize.define('topicOfAppeal', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const StatusOfAppeal = sequelize.define('statusOfAppeal', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

const Appeal = sequelize.define('appeal', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const Message = sequelize.define('message', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  text: {type: DataTypes.STRING},
  isSupport: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false}
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

Ad.hasMany(ImageAd)
ImageAd.belongsTo(Ad)

Ad.hasMany(PreviewImageAd)
PreviewImageAd.belongsTo(Ad)

Ad.hasMany(CommercialImageAd)
CommercialImageAd.belongsTo(Ad)
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

//Характеристики - Значения
Characteristic.hasMany(CharacteristicValue)
CharacteristicValue.belongsTo(Characteristic)

TypeCharacteristic.hasMany(Characteristic)
Characteristic.belongsTo(TypeCharacteristic)

//Характеристики для определнных категорий
Characteristic.hasMany(CharacteristicObject)
CharacteristicObject.belongsTo(Characteristic)

Characteristic.hasMany(CharacteristicSubCategory)
CharacteristicSubCategory.belongsTo(Characteristic)

Objects.hasMany(CharacteristicObject)
CharacteristicObject.belongsTo(Objects)

SubCategory.hasMany(CharacteristicSubCategory)
CharacteristicSubCategory.belongsTo(SubCategory)


//Характеристики - Объявления (ввод)
Ad.hasMany(AdCharacteristicInput)
AdCharacteristicInput.belongsTo(Ad)

Characteristic.hasMany(AdCharacteristicInput)
AdCharacteristicInput.belongsTo(Characteristic)


//Характеристики - Объявления (выбор)
Ad.hasMany(AdCharacteristicSelect)
AdCharacteristicSelect.belongsTo(Ad)

Characteristic.hasMany(AdCharacteristicSelect)
AdCharacteristicSelect.belongsTo(Characteristic)

CharacteristicValue.hasMany(AdCharacteristicSelect)
AdCharacteristicSelect.belongsTo(CharacteristicValue)

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

//Рейтинг
User.hasMany(Rating, {
  foreignKey: 'customerId'
})
Rating.belongsTo(User, {
  foreignKey: 'customerId'
})

User.hasMany(Rating, {
  foreignKey: 'sellerId'
})
Rating.belongsTo(User, {
  foreignKey: 'customerId'
})

User.hasMany(UserAvatar)
UserAvatar.belongsTo(User)
//Чат
Ad.hasMany(Chat)
Chat.belongsTo(Ad)

User.hasMany(Chat)
Chat.belongsTo(User)

Chat.hasMany(UserChat)
UserChat.belongsTo(Chat)

//Геоданные
PositionDistrict.hasMany(PositionRegion)
PositionRegion.belongsTo(PositionDistrict)

PositionRegion.hasMany(PositionCity)
PositionCity.belongsTo(PositionRegion)

//Поддержка
User.hasMany(Appeal)
Appeal.belongsTo(User)

TopicOfAppeal.hasMany(Appeal)
Appeal.belongsTo(TopicOfAppeal)

StatusOfAppeal.hasMany(Appeal)
Appeal.belongsTo(StatusOfAppeal)

Appeal.hasMany(Message)
Message.belongsTo(Appeal)

Message.hasMany(Message, { as: 'Children', foreignKey: 'parentId' });
Message.belongsTo(Message, { as: 'Parent', foreignKey: 'parentId' });

module.exports = {
  Rating, TypeCharacteristic, AdCharacteristicInput, AdCharacteristicSelect,
  CharacteristicSubCategory, CharacteristicObject, Characteristic, UserAvatar,
  CharacteristicValue, Favorite, AdView, Ad, TypeAd, StatusAd, Objects,
  Role, Category, SubCategory, User, Chat, ImageAd, PreviewImageAd, StaticAd,
  Booking, PositionCity, PositionRegion, PositionDistrict, TopicOfAppeal,
  StatusOfAppeal, Appeal, Message, CommercialImageAd
}
