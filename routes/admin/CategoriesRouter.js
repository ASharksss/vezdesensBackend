const Router = require('express')
const categoriesController = require('../../controllers/admin/CategoriesController')

const router = new Router()

router.post( '/addCategory', categoriesController.createCategories)

module.exports = router