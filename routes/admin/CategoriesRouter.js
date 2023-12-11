const Router = require('express')
const categoriesController = require('../../controllers/admin/CategoriesController')

const router = new Router()


router.get('/getCategories', categoriesController.getCategories)
router.get('/getCategoriesList', categoriesController.getCategoriesList)
router.get('/getSubCategories', categoriesController.getSubCategories)
router.get('/getObjects', categoriesController.getObjects)


router.post( '/addCategory', categoriesController.createCategories)
router.post( '/addSubCategory', categoriesController.createSubCategories)
router.post( '/createObject', categoriesController.createObject)

module.exports = router