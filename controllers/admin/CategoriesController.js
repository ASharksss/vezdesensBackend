const ApiError = require('../../error/ApiError')
const {Category, SubCategory,
	Objects, Ad} = require('../../models')
const {Op} = require("sequelize");

class CategoriesController {

  async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name']
      })
			const currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0);
			const ads = await Ad.findAll({
				where: {
					typeAdId: 4,
					dateEndActive: {
						[Op.gt]: currentDate,
					}
				}
			})
      return res.json({categories, premium: ads.length !== 2})
    } catch (e) {
			console.log(e)
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

  async createCategories(req, res, next) {
    try {
      const {categoryName} = req.body
      const cat = await Category.create({name: categoryName})
      return res.json(cat)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getCategoriesList(req, res, next) {
    try {
			const {categoryId} = req.query
			if (categoryId) {
				const categories = await Category.findAll({
					where: {id: categoryId},
					attributes: ['id', 'name'],
					include: [{
						model: SubCategory,
						attributes: ['id', 'name', 'categoryId'],
						include: {
							model: Objects,
							attributes: ['id', 'name', 'subCategoryId']
						}
					}]
				})
				return res.json(categories)
			}
      const categories = await Category.findAll({
        attributes: ['id', 'name'],
        include: {
          model:SubCategory,
          attributes: ['id', 'name', 'categoryId'],
					include: {
						model: Objects,
						attributes: ['id', 'name', 'subCategoryId']
					}
        }
      })
      return res.json(categories)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async createSubCategories(req, res, next) {
    try {
      const {subcategory, categoryId} = req.body
      const subCat = await SubCategory.create({subcategory, categoryId})
      return res.json(subCat)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async createObject(req, res, next) {
    try {
      const {object, subCategoryId} = req.body
      const obj = await Objects.create({object, subCategoryId})
      return res.json(obj)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new CategoriesController()