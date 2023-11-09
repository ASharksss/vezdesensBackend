const ApiError = require("../error/ApiError");
const {
  Ad,
  Category,
  SubCategory,
  Objects,
  TypeAd,
  Booking,
  AdView,
  Favorite,
  CharacteristicObject, CharacteristicSubCategory, Characteristic, CharacteristicValue, TypeCharacteristic,
  AdCharacteristicInput, AdCharacteristicSelect, User,
} = require('../models')
const {Op} = require("sequelize");

class AdController {


  async createAd(req, res, next) {

    try {
      const {
        title, price, description,
        address, longevity, userId,
        typeAdId, statusAdId, objectId,
        bookingDateStart, bookingDateEnd, characteristicsInput,
        characteristicsSelect
      } = req.body


      let priceTypeAd, ad, time, cost, booking, characterInput, characterSelect
      const currentDate = new Date()

      //Бронирование дорогих плашек
      if (typeAdId === 2 || typeAdId === 3 || typeAdId === 4) {

        //Вытаскиваем стоимость за 1 день
        priceTypeAd = await TypeAd.findByPk(typeAdId, {
          attributes: ['price']
        })

        //Определяем срок бронирования
        time = (new Date(bookingDateEnd) - new Date(bookingDateStart)) / 1000 / 60 / 60 / 24

        //Определяем стоимость бронирования
        cost = time * priceTypeAd.price

        //Тут функция оплаты

        //Создаем объявление
        ad = await Ad.create({
          title, price, description,
          address, longevity, userId,
          typeAdId, statusAdId, objectId,
          dateEndActive: new Date(currentDate.setDate(currentDate.getDate() + 30)) //Дата окончания показов
        })

        //Запись характеристик enter
        characteristicsInput.map(async (item) => {
          characterInput = await AdCharacteristicInput.create({
            adId: ad.id,
            characteristicId: item.characteristicId,
            value: item.value
          })
        })
        //Запись характеристик Checkbox
        characteristicsSelect.map(async (item) => {
          //Проверка Checkbox или Radio
          let checkNumber = Number.isInteger(item.value)
          //Radio
          if (checkNumber) {
            characterSelect = await AdCharacteristicSelect.create({
              adId: ad.Id,
              characteristicId: item.characteristicId,
              valueId: item.value
            })
          } else {
            //Checkbox
            item.value.map(async (value) => {
              try {
                characterSelect = await AdCharacteristicSelect.create({
                  adId: ad.Id,
                  characteristicId: item.characteristicId,
                  valueId: value
                })
              } catch (e) {
                return next(ApiError.badRequest(e.message))
              }
            })
          }
        })


        //Запись бронирования
        booking = await Booking.create({
          userId, typeAdId, adId: ad.id, dateStart: bookingDateStart, dateEnd: bookingDateEnd, cost
        })
      } else {
        //Создаем объявление без брони
        ad = await Ad.create({
          title, price, description,
          address, longevity, userId,
          typeAdId, statusAdId, objectId,
          dateEndActive: new Date(currentDate.setDate(currentDate.getDate() + 30)) //Дата окончания показов
        })

        //Запись характеристик enter
        characteristicsInput.map(async (item) => {
          characterInput = await AdCharacteristicInput.create({
            adId: ad.id,
            characteristicId: item.characteristicId,
            value: item.value
          })
        })
        //Запись характеристик Checkbox
        characteristicsSelect.map(async (item) => {
          //Проверка Checkbox или Radio
          let checkNumber = Number.isInteger(item.value)
          //Radio
          if (checkNumber) {
            characterSelect = await AdCharacteristicSelect.create({
              adId: ad.Id,
              characteristicId: item.characteristicId,
              valueId: item.value
            })
          } else {
            //Checkbox
            item.value.map(async (value) => {
              try {
                characterSelect = await AdCharacteristicSelect.create({
                  adId: ad.Id,
                  characteristicId: item.characteristicId,
                  valueId: value
                })
              } catch (e) {
                return next(ApiError.badRequest(e.message))
              }
            })
          }
        })

      }
      return res.json({ad, characteristics});
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getOneAd(req, res, next) {
    try {

      const adId = req.params.id

      /*const {adId, userId} = req.query*/
      let view

      //Достаем объявление
      const ad = await Ad.findOne({
        where: [{id: adId}],

        include: [
          {model: AdView}, {model: User}
        ]
      })

      //Получение просмотров по объявлению
      const viewsOfAd = await AdView.findAndCountAll({
        where: {adId}
      })


      //Количество просмотров
      const viewsCount = viewsOfAd.count
/*
      //Все просмотры по объявлению
      const tableViews = await AdView.findOne({
        where: {
          [Op.and]: [{adId, userId}]
        }
      })

      //Если совпадение не найдено - создаем
      if (!tableViews) {
        view = await AdView.create({
          userId,
          adId
        })
        view.save()
      }*/
      return res.json({ad,viewsCount})
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }

  }

  async inFavorite(req, res) {
    try {
      const {adId, userId} = req.query
      const favoritesOfUser = await Favorite.findOrCreate({
        where: {adId, userId}
      })
      return res.json(favoritesOfUser)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async editAd(req, res) {

  }

  async deleteAd(req, res) {

  }


}

module.exports = new AdController()