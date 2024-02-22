const ApiError = require('../../error/ApiError')
const {Category, SubCategory,
	Objects, Ad, TypeCharacteristic, CharacteristicObject, Characteristic, CharacteristicValue} = require('../../models')
const {Op, col} = require("sequelize");
const { groupByCharacteristic } = require('../../utils');

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


  async createSubCategories(req, res, next) {
    try {
      const {categoryId, arrSub} = req.body

      arrSub.map(async (item) => {
        console.log(item)
        await SubCategory.create({name: item, categoryId: categoryId})
      })

      return res.json(arrSub)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async getCategoriesList(req, res, next) {
    try {
			const {categoryId, object} = req.query
			if (categoryId) {
				const categories = await Category.findAll({
					where: {id: categoryId},
					attributes: ['id', 'name'],
					include: [{
						model: SubCategory,
                        as: 'subCategories',
						attributes: ['id', 'name', 'categoryId'],
						include: {
							model: Objects,
                            as: 'objects',
							attributes: ['id', 'name', 'subCategoryId']
						}
					}]
				})
                const filter = await CharacteristicObject.findAll({
                    where: {objectId: object},
                    attributes: ['id'],
                    include: {
                        model: Characteristic,
                        include: [{model: CharacteristicValue, attributes: ['id', 'name']}, {
                            model: TypeCharacteristic,
                            attributes: ['name']
                        }],
                        attributes: ['id', 'name', 'required'],
                        order: [['required', 'DESC'], ['name', 'ASC']]
                    }
                })
                categories.push(...[filter])
				return res.json(categories)
			}
      const categories = await Category.findAll({
        attributes: ['id', 'name'],
        include: {
            model:SubCategory,
            as: 'subCategories',
            attributes: ['id', 'name', 'categoryId'],
            include: {
                model: Objects,
                as: 'objects',
                attributes: ['id', 'name', 'subCategoryId']
            }
        }
      })
      return res.json(categories)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }



  async createObject(req, res, next) {
    try {
      const {arrObj, subCategoryId} = req.body
      arrObj.map(async (item) => {
        console.log(item)
        await Objects.create({name: item, subCategoryId: subCategoryId})
      })
      return res.json(subCategoryId)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new CategoriesController()
