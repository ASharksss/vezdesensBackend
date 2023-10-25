const ApiError = require('../error/ApiError')
const {Ad, Objects, SubCategory, Category, TypeAd, User} = require('../models')
const {Op} = require("sequelize");


class BoardController {

  async getAll(req, res, next) {
    try {

      const {subCategoryId, objectId} = req.query
      let ads
      const currentDate = new Date()

      //Проверка на категорию
      if (!subCategoryId && !objectId) {
        ads = await Ad.findAll({
          where: {
            [Op.or]: [{ statusAdId: 1 },{ statusAdId: 2 }]
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

        for (let i = 0; i < ads.length; i++) {
          if (ads[i].dateEndActive <= currentDate) {
            ads[i].statusAdId = 3
            ads[i].save()
          }
        }
      }

      if (subCategoryId && !objectId) {
        ads = await Ad.findAll({
          include: [{
            model: Objects,
            where: [
              {subCategoryId: subCategoryId},
              {[Op.or]: [{statusAdId: 1},{statusAdId: 2}]}
            ],
            include: [{
              model: SubCategory,
              include: Category
            }]},
            {model: TypeAd},
            {model: User}
          ]
        })

        for (let i = 0; i < ads.length; i++) {
          if (ads[i].dateEndActive <= currentDate) {
            ads[i].statusAdId = 3
            ads[i].save()
          }
        }
      }

      if (!subCategoryId && objectId) {
        ads = await Ad.findAll({
          where: [
            {objectId: objectId},
            {[Op.or]: [{statusAdId: 1},{statusAdId: 2}]}
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

        for (let i = 0; i < ads.length; i++) {
          if (ads[i].dateEndActive <= currentDate) {
            ads[i].statusAdId = 3
            ads[i].save()
          }
        }
      }
      return res.json(ads)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }


}

module.exports = new BoardController()
