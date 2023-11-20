const Router = require('express')
const categoriesController = require('../../controllers/admin/CategoriesController')
const adController = require("../../controllers/adController");

const router = new Router()


router.get('/getCategories', categoriesController.getCategories)
router.get('/getCategoriesList', categoriesController.getCategoriesList)
router.get('/getSubCategories', categoriesController.getSubCategories)
router.get('/getObjects', categoriesController.getObjects)


router.post( '/addCategory', categoriesController.createCategories)

module.exports = router