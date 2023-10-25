const ApiError = require("../error/ApiError");
const {Ad, Category, SubCategory, Objects, TypeAd, Booking, AdView, } = require('../models')
const {Op} = require("sequelize");

class AdController {


  async createAd(req, res, next) {
    try {

      const {
        title, price, description,
        address, longevity, userId,
        typeAdId, statusAdId, objectId,
        bookingDateStart, bookingDateEnd
      } = req.body

      console.log(bookingDateStart, bookingDateEnd)

      let priceTypeAd, ad, time, cost, booking
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
      }
      return res.json(ad);
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getOneAd(req, res) {
    const {adId, userId} = req.query
    let view

    //Достаем объявление
    const ad = await Ad.findOne({
      where: [{id: adId}],
      include: [{
        model: AdView
      }]
    })

    //Получение просмотров по объявлению
    const viewsOfAd = await AdView.findAndCountAll({
      where: {adId}
    })

    //Количество просмотров
    const viewsCount = viewsOfAd.count

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
     }
    return res.json({ad, viewsCount})
  }

  async editAd(req, res) {

  }

  async deleteAd(req, res) {

  }


}

module.exports = new AdController()