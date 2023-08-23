const Router = require('express')
const router = new Router()
const adController = require('../controllers/adController')



router.get('/:id')
router.get('/getCategories', adController.getCategories)
router.get('/getSubCategories', adController.getSubCategories)
router.get('/getObjects', adController.getObjects)
router.post('/createAd', adController.createAd)



module.exports = router
