const ApiError = require('../error/ApiError')
const {Ad, Objects, SubCategory, Category, TypeAd} = require('../models')


class BoardController {

  async getAll(req, res, next) {

    try {
      const {subCategoryId, objectId} = req.query
      let ads
      if (!subCategoryId && !objectId) {
        ads = await Ad.findAll({
          include: [{
            model: Objects,
            include: [{
              model: SubCategory,
              include: Category
            }]
          },
            {
            model: TypeAd
          },
          ]
        })
      }
      if (subCategoryId && !objectId) {
        ads = await Ad.findAll({
          include: [{
            model: Objects,
            where: {subCategoryId: subCategoryId},
            include: [{
              model: SubCategory,
              include: Category
            }]
          },
            {
              model: TypeAd
            },]
        })
      }
      if (!subCategoryId && objectId) {
        ads = await Ad.findAll({
          where: {objectId: objectId},
          include: [{
            model: Objects,
            include: [{
              model: SubCategory,
              include: Category
            }]
          },
            {
              model: TypeAd
            }]
        })
      }
      return res.json(ads)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new BoardController()
