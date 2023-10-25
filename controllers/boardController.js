const ApiError = require('../error/ApiError')
const {Ad, Objects, SubCategory, Category, TypeAd, User, Booking} = require('../models')
const {Op} = require("sequelize");


class BoardController {

  async getAll(req, res, next) {
    try {

      const {subCategoryId, objectId} = req.query
      let ads, allAds, bookings
      const currentDate = new Date()

      allAds = await Ad.findAll()
      bookings = await Booking.findAll()

      //Перебор всех объявлений
      for (let i = 0; i < allAds.length; i++) {
        //Проверка на просроченные объявления
        if (allAds[i].dateEndActive < currentDate) {
          allAds[i].statusAdId = 3
          await allAds[i].save()
        }
        //Перебор всех бронирований
        for (let i = 0; i < bookings.length; i++) {
          //Проверка на дату бронирования
          if (bookings[i].dateEnd < currentDate) {
            bookings[i].isActive = 0
            allAds[i].typeAdId = 1
            allAds[i].save()
            bookings[i].save()
          }
        }
      }

      //Проверка на категорию
      if (!subCategoryId && !objectId) {
        ads = await Ad.findAll({
          where: {
            [Op.or]: [{statusAdId: 1}, {statusAdId: 2}]
          },
          include: [{
            model: Objects,
            include: [{
              model: SubCategory,
              include: Category
            }]
          },
            {model: TypeAd},
            {model: User}
          ]
        })

      }

      if (subCategoryId && !objectId) {
        ads = await Ad.findAll({
          include: [{
            model: Objects,
            where: [
              {subCategoryId: subCategoryId},
              {[Op.or]: [{statusAdId: 1}, {statusAdId: 2}]}
            ],
            include: [{
              model: SubCategory,
              include: Category
            }]
          },
            {model: TypeAd},
            {model: User}
          ]
        })
      }

      if (!subCategoryId && objectId) {
        ads = await Ad.findAll({
          where: [
            {objectId: objectId},
            {[Op.or]: [{statusAdId: 1}, {statusAdId: 2}]}
          ],
          include: [{
            model: Objects,
            include: [{
              model: SubCategory,
              include: Category
            }]
          },
            {model: TypeAd},
            {model: User}
          ]
        })

      }
      return res.json(ads)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }


}

module.exports = new BoardController()
