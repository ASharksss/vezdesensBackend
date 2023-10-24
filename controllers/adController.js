const ApiError = require("../error/ApiError");
const {Ad, Category, SubCategory, Objects, TypeAd, Booking} = require('../models')
const {INTEGER} = require("sequelize");

class AdController {


  async createAd(req, res, next) {
    try {

      const {
        title, price, description,
        address, longevity, userId,
        typeAdId, statusAdId, objectId,
        bookingDateStart, bookingDateEnd
      } = req.body

      let priceTypeAd, ad, time, cost, booking
      const currentDate = new Date()

      if (typeAdId === 2 || typeAdId === 3 || typeAdId === 4) {

        //Вытаскиваем стоимость за 1 день
        priceTypeAd = await TypeAd.findByPk(typeAdId, {
          attributes: ['price']
        })

        //Определяем срок бронирования
        time = (new Date(bookingDateEnd) - new Date(bookingDateStart)) / 1000 / 60 / 60 / 24

        //Определяем стоимость бронирования
        cost = time * priceTypeAd.price

        //Создаем объявление
        ad = await Ad.create({
          title,
          price,
          description,
          address,
          longevity,
          userId,
          typeAdId,
          statusAdId,
          objectId,
          dateEndActive: new Date(currentDate.setDate(currentDate.getDate() + 30)) //Дата окончания показов
        })

        //Запись бронирования
        booking = await Booking.create({
          userId, typeAdId, adId: ad.id,
          dateStart: bookingDateStart,
          dateEnd: bookingDateEnd, cost
        })
      } else {

        //Создаем объявление
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

  async editAd(req, res) {

  }

  async deleteAd(req, res) {

  }

  async checkTypeAd(req, res) {
    try {

    } catch (e) {

    }
  }

}

module.exports = new AdController()