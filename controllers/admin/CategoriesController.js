const ApiError = require('../../error/ApiError')
const {Category} = require('../../models')
const {SubCategory} = require('../../models')
const {Objects} = require('../../models')

class CategoriesController {
    async createCategories(req, res, next) {
        try {
            const {category} = req.body
            const cat = await Category.create({category})
            return res.json(cat)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async createSubCategories(req, res, next) {
        try {
            const {subcategory, categoryId} = req.body
            const cat = await SubCategory.create({subcategory,categoryId})
            return res.json(cat)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async createObject(req, res, next) {
        try {
            const {object, subCategoryId} = req.body
            const cat = await Objects.create({object, subCategoryId})
            return res.json(cat)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }


}

module.exports = new CategoriesController()