const ApiError = require('../error/ApiError')
const {Ad, Objects, SubCategory, Category, TypeAd, User, Booking, Favorite} = require('../models')
const {Op, literal} = require("sequelize");


class BoardController {

  async getAll(req, res, next) {
    try {

      const {subCategoryId, objectId, offset= 1} = req.query
      let ads, allAds, bookings
      const currentDate = new Date()
			const userId = req.user
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
            {model: User},
						{
							model: Favorite,
							where: {userId},
							required: false
						}
          ],
            limit: 15,
            offset: parseInt(offset)
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
            {model: User},
						{
							model: Favorite,
							where: {userId},
							required: false
						}
          ],
            limit: 15,
            offset: parseInt(offset)
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
            {model: User},
						{
							model: Favorite,
							where: {userId},
							required: false
						}
          ],
            limit: 15,
            offset: parseInt(offset)
        })

      }
      return res.json({ads, offset})
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }


}

module.exports = new BoardController()
