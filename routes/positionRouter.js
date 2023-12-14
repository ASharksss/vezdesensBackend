const Router = require('express')
const router = new Router()
const positionController = require('../controllers/positionController')

router.post('/search', positionController.search)

module.exports = router
