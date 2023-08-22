const Router = require('express')
const router = new Router()
const adController = require('../controllers/adController')



router.get('/:id')
router.post('/createAd', adController.createAd)



module.exports = router
