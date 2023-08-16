const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const Ad = sequelize.define('ad', {
    id: {type: DataTypes.UUID, primaryKey: true},
    title: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    description: {type: DataTypes.STRING(5000), allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    longevity: {type: DataTypes.INTEGER, defaultValue: 30},
    views: {type: DataTypes.INTEGER, defaultValue: 0}
})

const TypeAd = sequelize.define('typeAd', {
    id: {type: DataTypes.UUID, primaryKey: true},
    name: {type: DataTypes.STRING},
    size: {type: DataTypes.STRING},
    price: {type: DataTypes.DECIMAL}
})

const StatusAd = sequelize.define('statusAd', {
    id: {type: DataTypes.UUID, primaryKey: true}, name: {type: DataTypes.STRING}
})

const Category = sequelize.define('category', {
    id: {type: DataTypes.UUID, primaryKey: true}, name: {type: DataTypes.STRING}
})

const SubCategory = sequelize.define('subCategory', {
    id: {type: DataTypes.UUID, primaryKey: true}, name: {type: DataTypes.STRING}
})

const Objects = sequelize.define('objects', {
    id: {type: DataTypes.UUID, primaryKey: true}, name: {type: DataTypes.STRING}
})

const User = sequelize.define('user', {
    id: {type: DataTypes.UUID, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
})

const Role = sequelize.define('user', {
    id: {type: DataTypes.UUID, primaryKey: true}, name: {type: DataTypes.STRING, allowNull: false},
})

//Relationships

//Объявления

User.hasMany(Ad)
Ad.belongsTo(User)

TypeAd.hasMany(Ad)
Ad.belongsTo(TypeAd)

StatusAd.hasMany(Ad)
Ad.belongsTo(StatusAd)

Objects.hasMany(Ad)
Ad.belongsTo(Objects)


//Категории
SubCategory.hasMany(User)
User.belongsTo(SubCategory)

SubCategory.hasMany(Category)
Category.belongsTo(SubCategory)

module.exports = {
    User, Ad, TypeAd,
    StatusAd, Objects, Role,
    Category, SubCategory
}

