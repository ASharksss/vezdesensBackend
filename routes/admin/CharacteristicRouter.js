const Router = require('express')
const router = new Router()
const characteristicController = require('../../controllers/admin/characteristicController')


router.post('/createCharacteristic', characteristicController.createCharacteristic)

module.exports = router
