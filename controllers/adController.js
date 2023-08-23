const ApiError = require("../error/ApiError");
const {Ad, Category, SubCategory, Objects} = require('../models')

class AdController {

  async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name']
      })
      return res.json(categories)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
  async getSubCategories(req, res, next) {
    try {
      const {categoryId} = req.query
      const subCategories = await SubCategory.findAll({
        attributes: ['id', 'name'],
        where: {
          categoryId: categoryId
        }
      })
      return res.json(subCategories)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
  async getObjects(req, res, next) {
    try {
      const {subCategoryId} = req.query
      const objects = await Objects.findAll({
        attributes: ['id', 'name'],
        where: {
          subCategoryId: subCategoryId
        }
      })
      return res.json(objects)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async createAd(req, res, next) {
    try {
      const {
        title, price, description,
        address, longevity, userId,
        typeAdId, statusAdId, objectId
      } = req.body
      const ad = await Ad.create({
        title,
        price,
        description,
        address,
        longevity,
        userId,
        typeAdId,
        statusAdId,
        objectId
      })
      return res.json(ad);
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