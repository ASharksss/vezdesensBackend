const Router = require('express')
const router = new Router()
const positionController = require('../controllers/positionController')

router.post('/add/region', positionController.postRegion)
router.post('/add/city', positionController.postCity)

module.exports = router
