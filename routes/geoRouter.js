const router = require('express')()
const geoController = require('../controllers/geoController')

router.post('/', geoController.getCity)

module.exports = router
