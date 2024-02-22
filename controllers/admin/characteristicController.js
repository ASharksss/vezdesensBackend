const ApiError = require('../../error/ApiError')
const db = require('../../models')
const {
  Characteristic,
  CharacteristicValue,
  CharacteristicObject,
  CharacteristicSubCategory, TypeCharacteristic, AdCharacteristicInput
} = require('../../models');

class CharacteristicController {


  async createAll(req, res, next) {
    try {
      const {objectId, typeId, charName, charValueAll, required} = req.body
      const char = await Characteristic.create(
        {name: charName, typeCharacteristicId: typeId, required})

      const unionObjChar = await CharacteristicObject.create({
        objectId, characteristicId: char.dataValues.id
      })


      typeId == 2 || typeId == 3 ?
        charValueAll.map(async (item) => {
          console.log(item)
          await CharacteristicValue.create({name: item, characteristicId: char.dataValues.id})
        }) : ''



      return res.json('Все нормульно')


    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getTypeCharacteristic(req, res, next) {
    try {
      const characteristic = await TypeCharacteristic.findAll()
      return res.json(characteristic)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }


  //Создание характеристики
  async createCharacteristic(req, res, next) {
    try {
      const {name} = req.body
      const characteristic = await Characteristic.findOrCreate({
        where: {name}
      })
      return res.json(characteristic)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }


  //Создание значений для характеристик
  async createCharacteristicValue(req, res, next) {
    try {
      const {name, characteristicId} = req.body
      const characteristicValue = await CharacteristicValue.findOrCreate({
        where: {
          name, characteristicId
        }
      })
      return res.json(characteristicValue)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  //Создание связи Характеристик и Объекта
  async createCharacteristicObject(req, res, next) {
    try {
      const {objectId, characteristicId} = req.body
      const characteristicObject = await CharacteristicObject.findOrCreate({
        where: {
          objectId, characteristicId
        }
      })
      return res.json(characteristicObject)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  //Создание связи Характеристик и Подкатегории
  async createCharacteristicSubCategory(req, res, next) {
    try {
      const {subCategoryId} = req.query
      const characteristicSubCategory = await CharacteristicSubCategory.findAll({
        where: {
          subCategoryId
        },
        include: [{model: Characteristic, include: {model: CharacteristicValue}, attributes: ['name']}]
      })
      return res.json(characteristicSubCategory)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }


  //Получение характеристик для добавления
  async getCharacteristicObject(req, res, next) {
    try {
      const {objectId} = req.query
      const characteristicObject = await db.CharacteristicObject.findAll({
        where: {objectId},
        attributes: ['characteristicId', 'objectId'],
        include: [{
          model: db.Characteristic,
          include: [{model: db.CharacteristicValue, attributes: ['id', 'name']}, {
            model: db.TypeCharacteristic,
            attributes: ['name']
          }],
          attributes: ['name', 'required']
        },]
      })
      return res.json(characteristicObject)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getCharacteristicSubCategory(req, res, next) {
    try {
      const {subCategoryId} = req.query
      const characteristicSubCategory = await CharacteristicSubCategory.findAll({
        where: {subCategoryId},
        attributes: ['characteristicId', 'subCategoryId'],
        include: [{
          model: Characteristic,
          include: [{model: CharacteristicValue, attributes: ['id', 'name']}, {
            model: TypeCharacteristic,
            attributes: ['name']
          }],
          attributes: ['name']
        },]
      })
      return res.json(characteristicSubCategory)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async unionAdCharacterInput(req, res, next) {
    try {
      const {adId, characteristicId, value} = req.body
      const adCharacteristic = await AdCharacteristicInput.create({adId, characteristicId, value})
      return res.json(adCharacteristic)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async unionAdCharacterSelect(req, res, next) {
    try {
      const {adId, characteristicId, characteristicValueId} = req.body
      const adCharacteristic = await unionAdCharacterSelect.create({adId, characteristicId, characteristicValueId})
      return res.json(adCharacteristic)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new CharacteristicController()
