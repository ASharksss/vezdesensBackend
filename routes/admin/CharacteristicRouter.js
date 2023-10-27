const Router = require('express')
const router = new Router()
const characteristicController = require('../../controllers/admin/characteristicController')


router.post('/createCharacteristic', characteristicController.createCharacteristic)
router.post('/createCharacteristicValue', characteristicController.createCharacteristicValue)
router.post('/createCharacteristicObject', characteristicController.createCharacteristicObject)
router.post('/createCharacteristicSubCategory', characteristicController.createCharacteristicSubCategory)


router.get('/getCharacteristicObject', characteristicController.getCharacteristicObject)


module.exports = router
