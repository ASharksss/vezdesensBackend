const Router = require('express')
const router = new Router()
const otherController = require('../controllers/otherController')

router.get('/image/:name', otherController.sendImage)
router.get('/promotion', otherController.promotion)

module.exports = router
